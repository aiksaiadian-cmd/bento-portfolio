import { useModeStore } from "@/store/modeStore";

describe("modeStore", () => {
  beforeEach(() => {
    useModeStore.setState({ mode: "edit" });
  });

  it("has initial mode 'edit'", () => {
    expect(useModeStore.getState().mode).toBe("edit");
  });

  it("toggles from edit to view", () => {
    useModeStore.getState().toggleMode();
    expect(useModeStore.getState().mode).toBe("view");
  });

  it("toggles from view to edit", () => {
    useModeStore.getState().toggleMode();
    useModeStore.getState().toggleMode();
    expect(useModeStore.getState().mode).toBe("edit");
  });

  it("sets mode to view", () => {
    useModeStore.getState().setMode("view");
    expect(useModeStore.getState().mode).toBe("view");
  });

  it("sets mode to edit", () => {
    useModeStore.getState().setMode("view");
    useModeStore.getState().setMode("edit");
    expect(useModeStore.getState().mode).toBe("edit");
  });
});
