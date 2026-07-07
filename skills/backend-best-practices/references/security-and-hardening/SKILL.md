---
name: security-and-hardening
description: Hardens code against vulnerabilities for web (Node/Express) and Apple (Swift/iOS/macOS) platforms. Use when handling user input, authentication, data storage, or external integrations. Use when building any feature that accepts untrusted data, manages user sessions, stores secrets in Keychain, configures App Transport Security, or interacts with third-party services.
---

# Security and Hardening

## Overview

Security-first development practices for web and Apple platform applications. Treat every external input as hostile, every secret as sacred, and every authorization check as mandatory. Security isn't a phase — it's a constraint on every line of code that touches user data, authentication, or external systems.

On Apple platforms, the OS provides strong primitives — Keychain, App Sandbox, Data Protection, ATS, CryptoKit, Secure Enclave — but only if you use them correctly. UserDefaults is not Keychain. ATS exceptions are not free. Entitlements are not opt-in decorations.

## When to Use

- Building anything that accepts user input
- Implementing authentication or authorization
- Storing or transmitting sensitive data
- Integrating with external APIs or services
- Adding file uploads, webhooks, or callbacks
- Handling payment or PII data
- Configuring Keychain, ATS, or App Sandbox (Apple)
- Adding biometric authentication (Face ID / Touch ID)
- Setting up entitlements or capabilities (Apple)

## Process: Threat Model First

Controls bolted on without a threat model are guesses. Before hardening, spend five minutes thinking like an attacker:

1. **Map the trust boundaries.** Where does untrusted data cross into your system? HTTP requests, form fields, file uploads, webhooks, third-party APIs, message queues, **LLM output**, deep links (Apple), pasteboard content (Apple), and inter-app communication (Apple URL schemes, App Groups).
2. **Name the assets.** What's worth stealing or breaking? Credentials, PII, payment data, admin actions, money movement, Keychain tokens, biometric-protected data.
3. **Run STRIDE over each boundary** — a quick lens, not a ceremony:

| Threat | Ask | Typical mitigation |
|---|---|---|
| **S**poofing | Can someone impersonate a user/service? | Authentication, signature verification, biometric auth |
| **T**ampering | Can data be altered in transit or at rest? | Integrity checks, parameterized queries, HTTPS, Data Protection |
| **R**epudiation | Can an action be denied later? | Audit logging of security events |
| **I**nformation disclosure | Can data leak? | Encryption, field allowlists, generic errors, Keychain |
| **D**enial of service | Can it be overwhelmed? | Rate limiting, input size caps, timeouts |
| **E**levation of privilege | Can a user gain rights they shouldn't? | Authorization checks, least privilege, entitlements |

4. **Write abuse cases next to use cases.** For each feature, ask "how would I misuse this?" — then make that your first test.

If you can't name the trust boundaries for a feature, you're not ready to secure it. This is OWASP **A04: Insecure Design** — most breaches begin in design, not code.

## The Three-Tier Boundary System

### Always Do (No Exceptions)

#### Web (Node/Express)

- **Validate all external input** at the system boundary (API routes, form handlers)
- **Parameterize all database queries** — never concatenate user input into SQL
- **Encode output** to prevent XSS (use framework auto-escaping, don't bypass it)
- **Use HTTPS** for all external communication
- **Hash passwords** with bcrypt/scrypt/argon2 (never store plaintext)
- **Set security headers** (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- **Use httpOnly, secure, sameSite cookies** for sessions
- **Run `npm audit`** (or equivalent) before every release

#### Apple (Swift/iOS)

- **Store secrets in Keychain** — never in UserDefaults, plists, or hardcoded strings
- **Enable App Transport Security (ATS)** — never add blanket `NSAllowsArbitraryLoads` exceptions
- **Enable Data Protection** for files containing sensitive data (`.completeProtection`)
- **Validate all Codable input** — custom `init(from:)` for untrusted JSON
- **Configure App Sandbox** with minimum required entitlements
- **Use CryptoKit** for hashing, encryption, and signing — never roll custom crypto
- **Code-sign all binaries** — enable Hardened Runtime for macOS
- **Validate deep links and universal links** — don't trust URL parameters blindly
- **Use HTTPS** for all network requests (enforced by ATS)

### Ask First (Requires Human Approval)

#### Both Platforms
- Adding new authentication flows or changing auth logic
- Storing new categories of sensitive data (PII, payment info)
- Adding new external service integrations
- Granting elevated permissions or roles

#### Web-Specific
- Changing CORS configuration
- Adding file upload handlers
- Modifying rate limiting or throttling

#### Apple-Specific
- Adding ATS exceptions (`NSAppTransportSecurity` domain entries)
- Adding entitlements or capabilities (Camera, Location, Contacts, etc.)
- Sharing Keychain access group across apps
- Changing provisioning profiles or code signing identity
- Adding App Groups for inter-app data sharing

### Never Do

#### Web (Node/Express)
- **Never commit secrets** to version control (API keys, passwords, tokens)
- **Never log sensitive data** (passwords, tokens, full credit card numbers)
- **Never trust client-side validation** as a security boundary
- **Never disable security headers** for convenience
- **Never use `eval()` or `innerHTML`** with user-provided data
- **Never store sessions in client-accessible storage** (localStorage for auth tokens)
- **Never expose stack traces** or internal error details to users

#### Apple (Swift/iOS)
- **Never store secrets in UserDefaults** — it's a plaintext plist file
- **Never disable ATS globally** (`NSAllowsArbitraryLoads = YES`) without a justified exception
- **Never add entitlements you don't need** — each is attack surface reviewed by App Review
- **Never hardcode signing identities** or embed provisioning profiles in source control
- **Never embed API keys in the app binary** — use server-side proxy or runtime config
- **Never use `String(contentsOf:)` on untrusted URLs** without validation
- **Never store passwords in plaintext** — use Keychain with appropriate accessibility

## OWASP Top 10 Prevention Patterns

These are prevention patterns, not a ranking. For the 2021 ordering, see the quick-reference table in `references/security-checklist.md`.

### Injection (SQL, NoSQL, OS Command)

#### Web (Node/Express)

```typescript
// BAD: SQL injection via string concatenation
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// GOOD: Parameterized query
const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

// GOOD: ORM with parameterized input
const user = await prisma.user.findUnique({ where: { id: userId } });
```

#### Apple (Swift/SwiftData)

```swift
// BAD: String interpolation in predicates
let query = "SELECT * FROM users WHERE id = '\(userId)'"

// GOOD: SwiftData with type-safe predicates
let descriptor = FetchDescriptor<User>(
    predicate: #Predicate { $0.id == userId }
)
let users = try modelContext.fetch(descriptor)

// GOOD: SQLite with parameterized query (if using raw SQLite)
var statement: OpaquePointer?
sqlite3_prepare_v2(db, "SELECT * FROM users WHERE id = ?", -1, &statement, nil)
sqlite3_bind_text(statement, 1, (userId as NSString).utf8String, -1, nil)
```

### Broken Authentication

#### Web (Node/Express)

```typescript
// Password hashing
import { hash, compare } from 'bcrypt';

const SALT_ROUNDS = 12;
const hashedPassword = await hash(plaintext, SALT_ROUNDS);
const isValid = await compare(plaintext, hashedPassword);

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET,  // From environment, not code
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,     // Not accessible via JavaScript
    secure: true,       // HTTPS only
    sameSite: 'lax',    // CSRF protection
    maxAge: 24 * 60 * 60 * 1000,  // 24 hours
  },
}));
```

#### Apple (Swift/CryptoKit + Keychain)

```swift
import CryptoKit

// Password hashing (using SHA256 + salt — for server-side, prefer Argon2 via Vapor)
func hashPassword(_ password: String, salt: Data) -> String {
    var hasher = SHA256()
    hasher.update(data: salt)
    hasher.update(data: Data(password.utf8))
    return hasher.finalize().map { String(format: "%02x", $0) }.joined()
}

// Token storage in Keychain (NOT UserDefaults)
func storeToken(_ token: String, for account: String) throws {
    let data = Data(token.utf8)
    let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrAccount as String: account,
        kSecAttrService as String: Bundle.main.bundleIdentifier!,
        kSecValueData as String: data,
        kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly,
    ]

    // Delete existing item first
    SecItemDelete(query as CFDictionary)

    let status = SecItemAdd(query as CFDictionary, nil)
    guard status == errSecSuccess else {
        throw KeychainError.unableToStore(status)
    }
}

func retrieveToken(for account: String) throws -> String? {
    let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrAccount as String: account,
        kSecAttrService as String: Bundle.main.bundleIdentifier!,
        kSecReturnData as String: true,
        kSecMatchLimit as String: kSecMatchLimitOne,
    ]

    var result: AnyObject?
    let status = SecItemCopyMatching(query as CFDictionary, &result)
    guard status == errSecSuccess, let data = result as? Data else { return nil }
    return String(data: data, encoding: .utf8)
}
```

### Cross-Site Scripting (XSS)

```typescript
// BAD: Rendering user input as HTML
element.innerHTML = userInput;

// GOOD: Use framework auto-escaping (React does this by default)
return <div>{userInput}</div>;

// If you MUST render HTML, sanitize first
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
```

### Broken Access Control

```typescript
// Always check authorization, not just authentication
app.patch('/api/tasks/:id', authenticate, async (req, res) => {
  const task = await taskService.findById(req.params.id);

  // Check that the authenticated user owns this resource
  if (task.ownerId !== req.user.id) {
    return res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'Not authorized to modify this task' }
    });
  }

  // Proceed with update
  const updated = await taskService.update(req.params.id, req.body);
  return res.json(updated);
});
```

### Security Misconfiguration

#### Web (Node/Express)

```typescript
// Security headers (use helmet for Express)
import helmet from 'helmet';
app.use(helmet());

// Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],  // Tighten if possible
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'"],
  },
}));

// CORS — restrict to known origins
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
}));
```

#### Apple (ATS / Info.plist)

```xml
<!-- GOOD: ATS enabled by default — no Info.plist entry needed -->
<!-- Only add exceptions for specific domains that genuinely require it: -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSExceptionDomains</key>
    <dict>
        <key>legacy-api.example.com</key>
        <dict>
            <key>NSExceptionAllowsInsecureHTTPLoads</key>
            <true/>
            <key>NSExceptionMinimumTLSVersion</key>
            <string>TLSv1.2</string>
        </dict>
    </dict>
</dict>

<!-- BAD: Never do this -->
<!-- <key>NSAllowsArbitraryLoads</key><true/> -->
```

### Sensitive Data Exposure

#### Web (Node/Express)

```typescript
// Never return sensitive fields in API responses
function sanitizeUser(user: UserRecord): PublicUser {
  const { passwordHash, resetToken, ...publicFields } = user;
  return publicFields;
}

// Use environment variables for secrets
const API_KEY = process.env.STRIPE_API_KEY;
if (!API_KEY) throw new Error('STRIPE_API_KEY not configured');
```

#### Apple (Swift)

```swift
// Never include sensitive fields in Codable output
struct PublicUser: Codable {
    let id: UUID
    let name: String
    let email: String
    // passwordHash, resetToken deliberately excluded
}

extension User {
    var publicRepresentation: PublicUser {
        PublicUser(id: id, name: name, email: email)
    }
}

// Read secrets from xcconfig (build-time), never hardcode
// In Config.xcconfig: API_KEY = $(STRIPE_API_KEY)
// In Info.plist: <key>StripeAPIKey</key><string>$(API_KEY)</string>
let apiKey = Bundle.main.infoDictionary?["StripeAPIKey"] as? String
```

### Server-Side Request Forgery (SSRF)

Any time the server fetches a URL the user influenced — webhooks, "import from URL", image proxies, link previews — an attacker can aim it at internal services (cloud metadata, `localhost`, private IPs).

```typescript
// BAD: fetch whatever the user gives you
await fetch(req.body.webhookUrl);

// GOOD: allowlist scheme + host, reject if ANY resolved IP is private, forbid redirects
import { lookup } from 'node:dns/promises';
import ipaddr from 'ipaddr.js';

const ALLOWED_HOSTS = new Set(['hooks.example.com']);

async function assertSafeUrl(raw: string): Promise<URL> {
  const url = new URL(raw);
  if (url.protocol !== 'https:') throw new Error('https only');
  if (!ALLOWED_HOSTS.has(url.hostname)) throw new Error('host not allowed');
  // Resolve ALL records; a single private/reserved address fails the check.
  const addrs = await lookup(url.hostname, { all: true });
  if (addrs.some((a) => ipaddr.parse(a.address).range() !== 'unicast')) {
    throw new Error('private/reserved IP');
  }
  return url;
}

await fetch(await assertSafeUrl(req.body.webhookUrl), { redirect: 'error' });
```

The `range() !== 'unicast'` check covers loopback, link-local `169.254.169.254` (cloud metadata, the #1 SSRF target), private, and unique-local ranges across IPv4 and IPv6.

**Caveat — this still has a TOCTOU gap.** `fetch` resolves DNS again after the check, so an attacker using a short-TTL record can rebind to an internal IP between validation and connection. For high-risk surfaces, resolve once and connect to the pinned IP, or put a filtering agent in front (`request-filtering-agent` / `ssrf-req-filter`).

## Apple Platform Security Patterns

### CryptoKit

```swift
import CryptoKit

// SHA256 hashing
let digest = SHA256.hash(data: Data("sensitive-data".utf8))
let hashString = digest.map { String(format: "%02x", $0) }.joined()

// Symmetric encryption (AES-GCM)
let key = SymmetricKey(size: .bits256)
let sealed = try AES.GCM.seal(plaintext, using: key)
let decrypted = try AES.GCM.open(sealed, using: key)

// HMAC signing
let authCode = HMAC<SHA256>.authenticationCode(for: Data(message.utf8), using: key)
let isValid = HMAC<SHA256>.isValidAuthenticationCode(authCode, authenticating: Data(message.utf8), using: key)

// P256 key agreement (Diffie-Hellman)
let privateKey = P256.KeyAgreement.PrivateKey()
let publicKey = privateKey.publicKey
let sharedSecret = try privateKey.sharedSecretFromKeyAgreement(with: otherPublicKey)
let symmetricKey = sharedSecret.hkdfDerivedSymmetricKey(
    using: SHA256.self,
    salt: Data(),
    sharedInfo: Data("MyApp-v1".utf8),
    outputByteCount: 32
)
```

### Biometric Authentication (Face ID / Touch ID)

```swift
import LocalAuthentication

func authenticateWithBiometrics() async throws -> Bool {
    let context = LAContext()
    var error: NSError?

    guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
        // Biometrics not available — fall back to passcode or password
        if let error {
            switch error.code {
            case LAError.biometryNotAvailable.rawValue:
                throw AuthError.biometricsNotAvailable
            case LAError.biometryNotEnrolled.rawValue:
                throw AuthError.biometricsNotEnrolled
            default:
                throw AuthError.unknown(error)
            }
        }
        return false
    }

    return try await context.evaluatePolicy(
        .deviceOwnerAuthenticationWithBiometrics,
        localizedReason: "Authenticate to access your account"
    )
}
```

**Info.plist requirement:**
```xml
<key>NSFaceIDUsageDescription</key>
<string>Authenticate to access your account</string>
```

### Certificate Pinning (URLSession)

```swift
class PinnedSessionDelegate: NSObject, URLSessionDelegate {
    private let pinnedHashes: Set<String> = [
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" // Base64 SHA256 of certificate's SPKI
    ]

    func urlSession(
        _ session: URLSession,
        didReceive challenge: URLAuthenticationChallenge
    ) async -> (URLSession.AuthChallengeDisposition, URLCredential?) {
        guard challenge.protectionSpace.authenticationMethod == NSURLAuthenticationMethodServerTrust,
              let serverTrust = challenge.protectionSpace.serverTrust else {
            return (.cancelAuthenticationChallenge, nil)
        }

        // Evaluate the trust chain
        var error: CFError?
        guard SecTrustEvaluateWithError(serverTrust, &error) else {
            return (.cancelAuthenticationChallenge, nil)
        }

        // Check pin against each certificate in the chain
        let certCount = SecTrustGetCertificateCount(serverTrust)
        for i in 0..<certCount {
            guard let cert = SecTrustCopyCertificateChain(serverTrust)?[i] as? SecCertificate else { continue }
            let certData = SecCertificateCopyData(cert) as Data
            let hash = SHA256.hash(data: certData)
            let hashString = Data(hash).base64EncodedString()
            if pinnedHashes.contains(hashString) {
                return (.useCredential, URLCredential(trust: serverTrust))
            }
        }

        return (.cancelAuthenticationChallenge, nil)
    }
}
```

### Keychain Services (Full CRUD)

```swift
enum KeychainError: Error {
    case unableToStore(OSStatus)
    case unableToRetrieve(OSStatus)
    case itemNotFound
}

struct KeychainService {
    let service: String

    init(service: String = Bundle.main.bundleIdentifier!) {
        self.service = service
    }

    // CREATE / UPDATE
    func set(_ value: Data, for key: String, accessibility: CFString = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly) throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecAttrService as String: service,
        ]
        // Delete existing
        SecItemDelete(query as CFDictionary)

        var addQuery = query
        addQuery[kSecValueData as String] = value
        addQuery[kSecAttrAccessible as String] = accessibility

        let status = SecItemAdd(addQuery as CFDictionary, nil)
        guard status == errSecSuccess else { throw KeychainError.unableToStore(status) }
    }

    // READ
    func get(_ key: String) throws -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecAttrService as String: service,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne,
        ]
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        if status == errSecItemNotFound { return nil }
        guard status == errSecSuccess else { throw KeychainError.unableToRetrieve(status) }
        return result as? Data
    }

    // DELETE
    func delete(_ key: String) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecAttrService as String: service,
        ]
        SecItemDelete(query as CFDictionary)
    }
}
```

**Keychain accessibility levels (choose the most restrictive that works):**

| Level | When Accessible | Use For |
|-------|----------------|---------|
| `kSecAttrAccessibleWhenUnlocked` | Only when device is unlocked | General tokens, user preferences |
| `kSecAttrAccessibleAfterFirstUnlock` | After first unlock until restart | Background refresh tokens |
| `kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly` | Only with passcode set, this device | High-security keys |
| `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` | After first unlock, this device only | Default for most secrets |

## Input Validation Patterns

### Web (Node/Express) — Schema Validation at Boundaries

```typescript
import { z } from 'zod';

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().datetime().optional(),
});

// Validate at the route handler
app.post('/api/tasks', async (req, res) => {
  const result = CreateTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: result.error.flatten(),
      },
    });
  }
  // result.data is now typed and validated
  const task = await taskService.create(result.data);
  return res.status(201).json(task);
});
```

### Apple (Swift/Codable) — Validated Decoding

```swift
// Custom Decodable init for validation at the decode boundary
struct CreateTaskRequest: Decodable {
    let title: String
    let description: String?
    let priority: Priority
    let dueDate: Date?

    enum Priority: String, Codable, CaseIterable {
        case low, medium, high
    }

    enum CodingKeys: String, CodingKey {
        case title, description, priority, dueDate
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)

        let rawTitle = try container.decode(String.self, forKey: .title)
        let trimmed = rawTitle.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else {
            throw DecodingError.dataCorrupted(.init(codingPath: [CodingKeys.title], debugDescription: "Title cannot be empty"))
        }
        guard trimmed.count <= 200 else {
            throw DecodingError.dataCorrupted(.init(codingPath: [CodingKeys.title], debugDescription: "Title exceeds 200 characters"))
        }
        self.title = trimmed

        let rawDesc = try container.decodeIfPresent(String.self, forKey: .description)
        if let desc = rawDesc, desc.count > 2000 {
            throw DecodingError.dataCorrupted(.init(codingPath: [CodingKeys.description], debugDescription: "Description exceeds 2000 characters"))
        }
        self.description = rawDesc

        self.priority = try container.decodeIfPresent(Priority.self, forKey: .priority) ?? .medium
        self.dueDate = try container.decodeIfPresent(Date.self, forKey: .dueDate)
    }
}

// Usage in Vapor route handler
func createTask(req: Request) async throws -> TaskResponse {
    let input = try req.content.decode(CreateTaskRequest.self)
    // input is now validated
    let task = try await taskService.create(input)
    return task.response
}
```

### File Upload Safety

```typescript
// Restrict file types and sizes
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function validateUpload(file: UploadedFile) {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new ValidationError('File type not allowed');
  }
  if (file.size > MAX_SIZE) {
    throw new ValidationError('File too large (max 5MB)');
  }
  // Don't trust the file extension — check magic bytes if critical
}
```

## App Sandbox and Data Protection (Apple)

### App Sandbox Configuration

```xml
<!-- Entitlements file: MyApp.entitlements -->
<!-- Only request capabilities you actually need -->
<dict>
    <key>com.apple.security.app-sandbox</key>
    <true/>

    <!-- Network access (if needed) -->
    <key>com.apple.security.network.client</key>
    <true/>

    <!-- File access (prefer user-selected via NSOpenPanel) -->
    <key>com.apple.security.files.user-selected.read-write</key>
    <true/>

    <!-- Camera (if needed — requires NSCameraUsageDescription in Info.plist) -->
    <!-- <key>com.apple.security.device.camera</key> -->
    <!-- <true/> -->
</dict>
```

### Hardened Runtime (macOS)

Enable Hardened Runtime in Xcode → Signing & Capabilities. It prevents:
- Loading unsigned libraries
- Injecting code via debugger (except during development)
- Accessing protected resources without entitlements
- Modifying process memory

### Data Protection

```swift
// Set file protection when writing sensitive data
try sensitiveData.write(
    to: fileURL,
    options: [.atomic, .completeFileProtection]
)

// Check protection level
let attributes = try FileManager.default.attributesOfItem(atPath: fileURL.path)
let protection = attributes[.protectionKey] as? FileProtectionType
// .complete — encrypted when locked
// .completeUnlessOpen — encrypted when locked, unless file handle is open
// .completeUntilFirstUserAuthentication — encrypted until first unlock after boot
```

### App Groups (Shared Data)

```swift
// Access shared container (requires com.apple.security.application-groups entitlement)
let sharedURL = FileManager.default.containerURL(
    forSecurityApplicationGroupIdentifier: "group.com.yourcompany.shared"
)

// Shared UserDefaults (still not for secrets — use Keychain with shared access group)
let sharedDefaults = UserDefaults(suiteName: "group.com.yourcompany.shared")
```

## Triaging npm audit Results

Not all audit findings require immediate action. Use this decision tree:

```
npm audit reports a vulnerability
├── Severity: critical or high
│   ├── Is the vulnerable code reachable in your app?
│   │   ├── YES --> Fix immediately (update, patch, or replace the dependency)
│   │   └── NO (dev-only dep, unused code path) --> Fix soon, but not a blocker
│   └── Is a fix available?
│       ├── YES --> Update to the patched version
│       └── NO --> Check for workarounds, consider replacing the dependency, or add to allowlist with a review date
├── Severity: moderate
│   ├── Reachable in production? --> Fix in the next release cycle
│   └── Dev-only? --> Fix when convenient, track in backlog
└── Severity: low
    └── Track and fix during regular dependency updates
```

**Key questions:**
- Is the vulnerable function actually called in your code path?
- Is the dependency a runtime dependency or dev-only?
- Is the vulnerability exploitable given your deployment context (e.g., a server-side vulnerability in a client-only app)?

When you defer a fix, document the reason and set a review date.

### Supply-Chain Hygiene

#### Web (npm)

`npm audit` catches known CVEs; it won't catch a malicious or typosquatted package. Also:

- **Commit the lockfile** and install with `npm ci` (not `npm install`) in CI — reproducible builds, no silent version drift.
- **Review new dependencies before adding them** — maintenance, download counts, and whether they truly earn their place. Every dependency is attack surface (OWASP **A06: Vulnerable Components**, **LLM03: Supply Chain**).
- **Be wary of `postinstall` scripts** in unfamiliar packages — they run arbitrary code at install time.
- **Watch for typosquats** — `cross-env` vs `crossenv`, `react-dom` vs `reactdom`.

#### Apple (Swift Package Manager)

- **Commit `Package.resolved`** — reproducible dependency resolution.
- **Review new packages before adding** — check maintainer, stars, update frequency.
- **Use exact version or range constraints** — avoid `.branch("main")` in production.
- **Verify binary dependency checksums** when using `.binaryTarget`:
  ```swift
  .binaryTarget(
      name: "SomeSDK",
      url: "https://example.com/SomeSDK.xcframework.zip",
      checksum: "abc123..." // SPM verifies this on download
  )
  ```
- **Audit transitive dependencies** — `swift package show-dependencies` to see the full tree.

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limit
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                   // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
}));

// Stricter limit for auth endpoints
app.use('/api/auth/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,  // 10 attempts per 15 minutes
}));
```

## Secrets Management

### Web (Node/Express)

```
.env files:
  ├── .env.example  → Committed (template with placeholder values)
  ├── .env          → NOT committed (contains real secrets)
  └── .env.local    → NOT committed (local overrides)

.gitignore must include:
  .env
  .env.local
  .env.*.local
  *.pem
  *.key
```

### Apple (Swift/iOS)

```
Secrets storage hierarchy (most to least secure):
  ├── Secure Enclave keys    → Hardware-bound, never leave the chip
  ├── Keychain               → Encrypted, OS-managed, survives app reinstall
  ├── xcconfig + CI secrets  → Build-time injection, not in binary
  └── ❌ UserDefaults         → NEVER (plaintext plist, trivially readable)
  └── ❌ Hardcoded strings    → NEVER (visible in binary with `strings` command)

.gitignore must include:
  *.xcconfig (if contains secrets)
  *.p12
  *.mobileprovision
  *.cer
  GoogleService-Info.plist (if contains API keys)
```

**xcconfig for build-time secrets:**
```
// Config/Secrets.xcconfig (NOT committed)
API_BASE_URL = https:$(FORWARD_SLASH)$(FORWARD_SLASH)api.example.com
API_KEY = your-secret-key-here

// Reference in Info.plist:
// <key>APIBaseURL</key><string>$(API_BASE_URL)</string>

// Read at runtime:
let baseURL = Bundle.main.infoDictionary?["APIBaseURL"] as? String
```

**Always check before committing:**
```bash
# Check for accidentally staged secrets
git diff --cached | grep -i "password\|secret\|api_key\|token"
```

**If a secret is ever committed, rotate it.** Deleting the line or rewriting history is not enough — assume it's compromised the moment it reaches a remote. Revoke and reissue the key first, then purge it from history.

## Securing AI / LLM Features

If your app calls an LLM — chatbots, summarizers, agents, RAG — it inherits a new attack surface. Map it to the [OWASP Top 10 for LLM Applications (2025)](https://genai.owasp.org/llm-top-10/):

- **Treat all model output as untrusted input (LLM05: Improper Output Handling).** Never pass LLM output straight into `eval`, SQL, a shell, `innerHTML`, or a file path. Validate and encode it exactly as you would raw user input.
- **Assume prompts can be hijacked (LLM01: Prompt Injection).** Untrusted text in the context window — a user message, a fetched web page, a PDF — can carry instructions. The system prompt is not a security boundary; enforce permissions in code, not in the prompt.
- **Keep secrets and other users' data out of prompts (LLM02 / LLM07).** Anything in the context can be echoed back. Don't put API keys, cross-tenant data, or the full system prompt where the model can repeat it.
- **Constrain tool and agent permissions (LLM06: Excessive Agency).** Scope tools to the minimum, require confirmation for destructive or irreversible actions, and validate every tool argument.
- **Bound consumption (LLM10: Unbounded Consumption).** Cap tokens, request rate, and loop/recursion depth so a crafted input can't run up cost or hang the system.
- **Isolate retrieval data (LLM08: Vector and Embedding Weaknesses).** In RAG, treat the vector store as a trust boundary: partition embeddings per tenant so one user can't retrieve another's data, and validate documents before indexing so poisoned content can't steer answers.

```typescript
// BAD: trusting model output as a command or as markup
const sql = await llm.generate(`Write SQL for: ${userQuestion}`);
await db.query(sql);                                   // arbitrary query execution
container.innerHTML = await llm.reply(userMessage);   // stored XSS, via the model

// GOOD: model output is data — parse defensively, then validate, then encode
let intent;
try {
  intent = CommandSchema.parse(JSON.parse(await llm.replyJson(userMessage)));
} catch {
  throw new ValidationError('unexpected model output'); // JSON.parse or schema failed
}
await runAllowlistedAction(intent.action, intent.params);
container.textContent = await llm.reply(userMessage);
```

## Security Review Checklist

### Web (Node/Express)

```markdown
### Authentication
- [ ] Passwords hashed with bcrypt/scrypt/argon2 (salt rounds ≥ 12)
- [ ] Session tokens are httpOnly, secure, sameSite
- [ ] Login has rate limiting
- [ ] Password reset tokens expire

### Authorization
- [ ] Every endpoint checks user permissions
- [ ] Users can only access their own resources
- [ ] Admin actions require admin role verification

### Input
- [ ] All user input validated at the boundary
- [ ] SQL queries are parameterized
- [ ] HTML output is encoded/escaped
- [ ] Server-side URL fetches are allowlisted (no SSRF to internal services)

### Data
- [ ] No secrets in code or version control
- [ ] Sensitive fields excluded from API responses
- [ ] PII encrypted at rest (if applicable)

### Infrastructure
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] CORS restricted to known origins
- [ ] Dependencies audited for vulnerabilities
- [ ] Error messages don't expose internals

### Supply Chain
- [ ] Lockfile committed; CI installs with `npm ci`
- [ ] New dependencies reviewed (maintenance, downloads, postinstall scripts)

### AI / LLM (if used)
- [ ] Model output treated as untrusted (no eval/SQL/innerHTML/shell)
- [ ] Secrets and other users' data kept out of prompts
- [ ] Tool/agent permissions scoped; destructive actions require confirmation
```

### Apple (Swift/iOS)

```markdown
### Authentication
- [ ] Tokens stored in Keychain (not UserDefaults)
- [ ] Biometric auth uses LAContext with proper error handling
- [ ] Keychain accessibility set to most restrictive level that works
- [ ] Session tokens have expiry and refresh logic

### Data Protection
- [ ] Sensitive files use .completeFileProtection
- [ ] Keychain items use appropriate accessibility level
- [ ] No sensitive data in UserDefaults or NSLog
- [ ] Secure Enclave used for high-value keys (if available)

### Network Security
- [ ] ATS enabled (no blanket NSAllowsArbitraryLoads)
- [ ] Certificate pinning for high-security endpoints
- [ ] No sensitive data in URL query parameters
- [ ] URLSession configured with appropriate timeouts

### App Sandbox
- [ ] Only required entitlements are requested
- [ ] Hardened Runtime enabled (macOS)
- [ ] App Groups scoped to minimum shared data
- [ ] Deep link / universal link parameters validated

### Supply Chain
- [ ] Package.resolved committed
- [ ] Binary target checksums verified
- [ ] New packages reviewed before adoption
- [ ] No .branch("main") dependencies in production
```

## See Also

For detailed security checklists and pre-commit verification steps, see `references/security-checklist.md`.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "This is an internal tool, security doesn't matter" | Internal tools get compromised. Attackers target the weakest link. |
| "We'll add security later" | Security retrofitting is 10x harder than building it in. Add it now. |
| "No one would try to exploit this" | Automated scanners will find it. Security by obscurity is not security. |
| "The framework handles security" | Frameworks provide tools, not guarantees. You still need to use them correctly. |
| "It's just a prototype" | Prototypes become production. Security habits from day one. |
| "Threat modeling is overkill here" | Five minutes of "how would I attack this?" prevents the design flaws no control can patch later. |
| "It's just LLM output, it's only text" | That "text" can be a SQL statement, a script tag, or a shell command. Treat it like any untrusted input. |
| "UserDefaults is fine for tokens" | UserDefaults is a plaintext plist. Use Keychain. |
| "ATS is annoying, just disable it" | ATS prevents MITM attacks. Add specific exceptions, never blanket disable. |
| "The app is sandboxed so it's secure" | Sandbox limits blast radius. You still need input validation, auth checks, and proper data protection. |

## Red Flags

### Web (Node/Express)
- User input passed directly to database queries, shell commands, or HTML rendering
- Secrets in source code or commit history
- API endpoints without authentication or authorization checks
- Missing CORS configuration or wildcard (`*`) origins
- No rate limiting on authentication endpoints
- Stack traces or internal errors exposed to users
- Dependencies with known critical vulnerabilities
- Server fetches user-supplied URLs without an allowlist (SSRF)
- LLM/model output passed into a query, the DOM, a shell, or `eval`
- Secrets, PII, or the full system prompt placed inside an LLM context window

### Apple (Swift/iOS)
- Secrets stored in UserDefaults, plists, or hardcoded strings
- ATS disabled globally (`NSAllowsArbitraryLoads = YES`)
- Entitlements added without justification or review
- Sensitive data written to files without Data Protection
- Keychain items using `.accessibleAlways` (deprecated and insecure)
- No certificate pinning for financial or auth endpoints
- Deep link parameters used without validation
- API keys embedded in app binary (visible via `strings`)
- Missing `NSFaceIDUsageDescription` when using biometric auth
- App Group sharing more data than necessary

## Verification

After implementing security-relevant code:

### Web (Node/Express)
- [ ] `npm audit` shows no critical or high vulnerabilities
- [ ] No secrets in source code or git history
- [ ] All user input validated at system boundaries
- [ ] Authentication and authorization checked on every protected endpoint
- [ ] Security headers present in response (check with browser DevTools)
- [ ] Error responses don't expose internal details
- [ ] Rate limiting active on auth endpoints
- [ ] Server-side URL fetches validated against an allowlist (no SSRF)
- [ ] LLM/model output validated and encoded before use (if AI features present)

### Apple (Swift/iOS)
- [ ] All secrets stored in Keychain with appropriate accessibility
- [ ] ATS enabled with only justified, specific exceptions
- [ ] Data Protection enabled for sensitive files
- [ ] Keychain accessibility uses most restrictive level that works
- [ ] Entitlements reviewed — no unnecessary capabilities
- [ ] Code signing and Hardened Runtime configured (macOS)
- [ ] Deep link and universal link parameters validated
- [ ] No sensitive data logged via os_log or print in release builds
- [ ] Biometric auth has proper error handling and fallback
