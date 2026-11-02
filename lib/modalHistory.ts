let openedInApp = false;

export function markModalOpenedInApp() {
  openedInApp = true;
}

export function consumeModalOpenedInApp(): boolean {
  const wasOpenedInApp = openedInApp;
  openedInApp = false;
  return wasOpenedInApp;
}

export function resetModalHistory() {
  openedInApp = false;
}
