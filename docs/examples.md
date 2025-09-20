---
layout: default
title: Examples
---

# Examples

Practical examples and code samples to help you get started with Project AruXI.

## Basic Usage

### Simple Setup

Here's a basic example of setting up Project AruXI:

```javascript
// Import the AruXI library
const AruXI = require('aruxi');

// Initialize with your configuration
const aruxi = new AruXI({
  apiKey: 'your-api-key',
  environment: 'development'
});

// Basic usage
aruxi.initialize()
  .then(() => {
    console.log('AruXI initialized successfully!');
  })
  .catch(err => {
    console.error('Initialization failed:', err);
  });
```

### Configuration Example

```yaml
# aruxi.config.yml
name: "My Application"
version: "1.0.0"
settings:
  debug: true
  timeout: 5000
  retries: 3
endpoints:
  api: "https://api.example.com"
  webhooks: "https://webhooks.example.com"
```

## Advanced Examples

### User Management

```javascript
// Create a new user
const newUser = await aruxi.users.create({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin'
});

// Get user information
const user = await aruxi.users.get(newUser.id);

// Update user
const updatedUser = await aruxi.users.update(user.id, {
  name: 'John Smith'
});

// List all users
const users = await aruxi.users.list({
  limit: 10,
  offset: 0
});
```

### Project Management

```javascript
// Create a new project
const project = await aruxi.projects.create({
  name: 'My New Project',
  description: 'A sample project',
  settings: {
    public: false,
    collaboration: true
  }
});

// Get project details
const projectDetails = await aruxi.projects.get(project.id);

// Add users to project
await aruxi.projects.addUser(project.id, user.id, 'contributor');
```

### Error Handling

```javascript
try {
  const result = await aruxi.api.call('/endpoint', {
    method: 'POST',
    data: { key: 'value' }
  });
  
  console.log('Success:', result);
} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    console.log('Rate limit exceeded, waiting...');
    setTimeout(() => {
      // Retry the request
    }, error.retryAfter * 1000);
  } else {
    console.error('API Error:', error.message);
  }
}
```

## Integration Examples

### Webhook Setup

```javascript
// Set up webhook endpoint
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  const event = req.body;
  
  switch (event.type) {
    case 'user.created':
      console.log('New user created:', event.data.user);
      break;
    case 'project.updated':
      console.log('Project updated:', event.data.project);
      break;
    default:
      console.log('Unknown event type:', event.type);
  }
  
  res.status(200).send('OK');
});

app.listen(3000);
```

### Database Integration

```javascript
// Using with MongoDB
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  aruxiId: String,
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Sync with AruXI
aruxi.users.list().then(users => {
  users.forEach(async user => {
    await User.findOneAndUpdate(
      { aruxiId: user.id },
      { ...user, aruxiId: user.id },
      { upsert: true }
    );
  });
});
```

## Testing Examples

### Unit Tests

```javascript
const { expect } = require('chai');
const AruXI = require('aruxi');

describe('AruXI Integration', () => {
  let aruxi;

  beforeEach(() => {
    aruxi = new AruXI({
      apiKey: 'test-api-key',
      environment: 'test'
    });
  });

  it('should initialize successfully', async () => {
    await aruxi.initialize();
    expect(aruxi.isInitialized).to.be.true;
  });

  it('should create a user', async () => {
    const user = await aruxi.users.create({
      name: 'Test User',
      email: 'test@example.com'
    });
    
    expect(user.id).to.be.a('string');
    expect(user.name).to.equal('Test User');
  });
});
```

## Performance Tips

### Batch Operations

```javascript
// Instead of multiple individual calls
for (const user of users) {
  await aruxi.users.update(user.id, updates);
}

// Use batch operations when available
await aruxi.users.batchUpdate(
  users.map(user => ({ id: user.id, updates }))
);
```

### Caching

```javascript
const cache = new Map();

async function getCachedUser(userId) {
  if (cache.has(userId)) {
    return cache.get(userId);
  }
  
  const user = await aruxi.users.get(userId);
  cache.set(userId, user);
  
  // Cache for 5 minutes
  setTimeout(() => cache.delete(userId), 5 * 60 * 1000);
  
  return user;
}
```

## Next Steps

- Explore the [API Reference](api-reference.html) for complete documentation
- Check out the [Getting Started](getting-started.html) guide
- Join our community discussions on GitHub