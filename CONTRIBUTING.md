# Contributing to Proyect

Thank you for your interest in contributing to this project! This document provides guidelines and best practices for contributing to our codebase.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Feature and Commit Naming Guide](#feature-and-commit-naming-guide)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)
- [Project Structure](#project-structure)

## Getting Started

Before you begin contributing, please:

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature or bug fix
4. Make your changes
5. Test your changes thoroughly
6. Submit a pull request

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/JTeban1/Proyect.git
   cd Proyect
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add necessary environment variables for database connection

4. Start the development server:

   ```bash
   npm start
   ```

## Coding Standards

### General Guidelines

- Use consistent indentation (2 or 4 spaces)
- Follow JavaScript ES6+ standards
- Write clear, descriptive variable and function names
- Add comments for complex logic
- Ensure all code is properly formatted

### File Organization

- Controllers: `app/controllers/`
- Models: `app/models/`
- Routes: `app/routes/`
- Configuration: `config/`
- Public assets: `public/`

## Feature and Commit Naming Guide

### Branch Naming Convention

When creating a new branch, use the following format:

```text
<type>/<short-description>
```

**Types:**

- `feature/` - New features or enhancements
- `bugfix/` - Bug fixes
- `hotfix/` - Critical fixes that need immediate attention
- `refactor/` - Code refactoring without functional changes
- `docs/` - Documentation updates
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks, dependency updates

**Examples:**

- `feature/user-authentication`
- `feature/cv-upload-functionality`
- `bugfix/database-connection-error`
- `hotfix/security-vulnerability`
- `refactor/controller-optimization`
- `docs/api-documentation`
- `test/unit-tests-for-models`
- `chore/update-dependencies`

### Commit Message Convention

Follow the conventional commit format:

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation only changes
- `style` - Changes that do not affect the meaning of the code
- `refactor` - A code change that neither fixes a bug nor adds a feature
- `perf` - A code change that improves performance
- `test` - Adding missing tests or correcting existing tests
- `chore` - Changes to the build process or auxiliary tools

**Scope (optional):**

- `api` - API related changes
- `ui` - User interface changes
- `db` - Database related changes
- `config` - Configuration changes
- `auth` - Authentication related changes

**Examples:**

```text
feat(api): add CV upload endpoint
fix(db): resolve connection timeout issue
docs: update README with installation instructions
style(ui): improve button styling consistency
refactor(controller): optimize CV processing logic
perf(db): add database indexing for faster queries
test(model): add unit tests for CvModel
chore(deps): update express to version 5.1.0
```

### Detailed Commit Guidelines

**Good commit messages:**

- `feat(cv): implement PDF text extraction functionality`
- `fix(api): handle file upload errors gracefully`
- `docs(contributing): add feature naming conventions`
- `refactor(routes): simplify CV route handlers`

**Bad commit messages:**

- `update stuff`
- `fix bug`
- `changes`
- `work in progress`

### Best Practices

1. **Keep commits atomic** - Each commit should represent a single logical change
2. **Write descriptive messages** - Explain what and why, not just what
3. **Use imperative mood** - "Add feature" instead of "Added feature"
4. **Limit subject line to 50 characters** - Keep it concise
5. **Separate subject from body with blank line**
6. **Use body to explain motivation** - When necessary

## Pull Request Process

1. **Create a descriptive PR title** following the same convention as commit messages
2. **Fill out the PR template** (if available)
3. **Reference related issues** using keywords like "Fixes #123" or "Closes #456"
4. **Ensure all tests pass** before submitting
5. **Request review** from team members
6. **Address feedback** promptly and professionally

### PR Title Examples

- `feat(cv): add AI-powered CV analysis feature`
- `fix(upload): resolve file size validation issue`
- `docs: update API documentation for CV endpoints`

## Code Review Guidelines

### For Reviewers

- Be constructive and respectful in feedback
- Focus on code quality, maintainability, and best practices
- Check for security vulnerabilities
- Verify that changes meet requirements
- Test the changes locally when possible

### For Contributors

- Respond to feedback professionally
- Make requested changes promptly
- Ask questions if feedback is unclear
- Update your PR based on review comments

## Project Structure

```text
Proyect/
├── app/
│   ├── controllers/     # Request handlers and business logic
│   │   └── CvController.js
│   ├── models/         # Data models and database interactions
│   │   └── CvModel.js
│   └── routes/         # API route definitions
│       └── CvRoutes.js
├── config/
│   └── db.js          # Database configuration
├── public/            # Static files and client-side code
│   ├── ai-cv.html
│   └── js/
│       └── ai-cv.js
├── app.js             # Main application entry point
├── package.json       # Project dependencies and scripts
└── README.md          # Project documentation
```

## Additional Guidelines

### Database Changes

- Create migration scripts for database schema changes
- Test migrations thoroughly before submitting
- Document any new database requirements

### API Changes

- Maintain backward compatibility when possible
- Update API documentation for any endpoint changes
- Add proper error handling and validation

### Testing

- Write tests for new features
- Ensure existing tests still pass
- Include both unit and integration tests where appropriate

### Security

- Never commit sensitive information (API keys, passwords, etc.)
- Use environment variables for configuration
- Follow security best practices for file uploads and data handling

## Getting Help

If you have questions or need help:

1. Check existing documentation
2. Search for existing issues
3. Create a new issue with detailed information
4. Reach out to the maintainers

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to our project! Your efforts help make this codebase better for everyone.
