// Counter application with TypeScript
class Counter {
  private count: number = 0;
  private countElement: HTMLElement;

  constructor(countElementId: string) {
    const element = document.getElementById(countElementId);
    if (!element) {
      throw new Error(`Element with id ${countElementId} not found`);
    }
    this.countElement = element;
  }

  increment(): void {
    this.count++;
    this.updateDisplay();
  }

  decrement(): void {
    this.count--;
    this.updateDisplay();
  }

  reset(): void {
    this.count = 0;
    this.updateDisplay();
  }

  private updateDisplay(): void {
    this.countElement.textContent = this.count.toString();
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const counter = new Counter("count");

  const incrementBtn = document.getElementById("incrementBtn");
  const decrementBtn = document.getElementById("decrementBtn");
  const resetBtn = document.getElementById("resetBtn");

  if (incrementBtn) {
    incrementBtn.addEventListener("click", () => counter.increment());
  }

  if (decrementBtn) {
    decrementBtn.addEventListener("click", () => counter.decrement());
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => counter.reset());
  }

  console.log("✨ TypeScript app initialized!");
});
