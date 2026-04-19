import { App, Plugin, WorkspaceLeaf, WorkspaceSplit } from "obsidian";

export default class AutoCloseGA extends Plugin {
	async onload() {
		const cleanUp = () => {
			const leaves = getRightSidebarLeaves(this.app);
			for (const leaf of leaves) {
				if (leaf.view.getViewType() === "empty") {
					leaf.detach();
				}
			}
		};
		// Graph analysis takes some time to init
		this.app.workspace.onLayoutReady(() => setTimeout(cleanUp, 1e3));
	}
	async onunload() { }
}

function getRightSidebarLeaves(app: App): WorkspaceLeaf[] {
	const leaves: WorkspaceLeaf[] = [];
	const rightSplit = app.workspace.rightSplit;

	if (!rightSplit) return leaves;

	const traverse = (node: any) => {
		if (node instanceof WorkspaceLeaf) {
			leaves.push(node);
		} else if (node instanceof WorkspaceSplit || node.children) {
			node.children?.forEach(traverse);
		}
	};

	traverse(rightSplit);
	return leaves;
}
