# Security Spec

1. Data Invariants:
- A NewsPost can only be created by an authenticated user whose email is `gashaw7abi@gmail.com` and who is email verified.
- A NewsPost must have a valid structure: headline, description, publishedAt, authorEmail, published.
- Anyone can read a NewsPost if its `published` field is true.

2. The Dirty Dozen Payloads:
- Payload 1: Missing headline
- Payload 2: authorEmail doesn't match request.auth.token.email
- Payload 3: Non-admin trying to create
- Payload 4: Invalid types for headline/description
- .... and so on.
