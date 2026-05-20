import { render, screen } from "@testing-library/react";
import { AppDataContext } from "../context/AppDataContext";
import Header from "./Header";
import { vi } from "vitest";

vi.mock("../context/AppDataContext", () => {
  return {
    useAppData: () => ({
      period: "2024-01",
      setPeriod: vi.fn(),
      usuario: { nombre: "Test User" },
      logout: vi.fn(),
      setActivePage: vi.fn(),
      notificaciones: [],
    })
  };
});

it("renders the header", () => {
  render(<Header />);
});
