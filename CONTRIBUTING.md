# Contributing

We welcome contributions to the **Google Workspace Email Orchestrator**. This project is maintained as an open-source tool for the internal automation community.

## 🛠️ Development Setup

1.  **Clone/Copy**: Apps Script projects must be copied to your own Google Drive.
2.  **Enable APIs**: Enable `Gmail API`, `Google Drive API`, `Google Sheets API`, and `Google Docs API` in the Apps Script project settings.
3.  **Test Environment**: Create a dedicated Google Doc (Template) and Google Sheet (Config) for testing to avoid impacting production data.

## 🐛 Reporting Issues

Please include the following in your report:
-   **Error Log**: Copy the full stack trace from the Apps Script Executions dashboard.
-   **Context**: Which template caused the error? Was it in `dryRun` mode?
-   **Reproduction**: Steps to reproduce the failure.

## 📝 Pull Request Guidelines

1.  **Style**: Use 2-space indentation and JSDoc comments for all public functions.
2.  **Safety First**: All new features must support `dryRun: true` mode.
3.  **Testing**:
    -   Run `testRunner()` for unit tests.
    -   Verify end-to-end logic using `generateEmailDraft(..., { dryRun: true })`.
4.  **Documentation**: Update `ARCHITECTURE.md` if you modify core services.

## 🧪 Testing

We prioritize testing pure functions (logic that doesn't call external APIs).
Run the test suite in `tests/TestRunner.js`:

```javascript
function runTests() {
  testRunner(); // Returns pass/fail results to the console
}
```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
