import { create } from "zustand";


export const artifactStore = create((set) => ({
    selectedArtifact: null,
    isOpen: false,

    openArtifact: (artifact) =>
        set({ selectedArtifact: artifact, isOpen: true }),

    closeArtifact: () =>
        set({ selectedArtifact: null, isOpen: false }),
}));