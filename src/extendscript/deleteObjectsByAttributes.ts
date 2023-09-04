const main = () => {
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL

	// ensure a document is open and the active spread contains any page item
	if (app.documents.length !== 0) {
		const activeWindow = app.activeWindow as LayoutWindow
		if (activeWindow.activeSpread.pageItems.length != 0) {
			showDialog()
		} else {
			alert('The active spread does not contain any page items.')
		}
	} else {
		alert('No documents are open. Please open a document and try again.')
	}
}

const SHAPE_LABELS = ['Rectangles', 'Polygons', 'Ellipses']
const SHAPE_LABELS_TO_OBJECT_TYPES: { [key: string]: string } = {
	Rectangles: 'rectangles',
	Polygons: 'polygons',
	Ellipses: 'ovals', // designers refer to them as ellipses
}

const showDialog = () => {
	// add a dialog
	const dialog = app.dialogs.add({ name: 'Select objects by attribute' })
	const columnText = dialog.dialogColumns.add({})
	const borderPanel = columnText.borderPanels.add({})

	// keep a reference to the controls we will add
	let controls: {
		shapes: CheckboxControl[]
	} = {
		shapes: [],
	}

	// populate shapes
	borderPanel.staticTexts.add({ staticLabel: 'Shape:' })
	const columnShapes = borderPanel.dialogColumns.add({})
	for (let i: number = 0; i < SHAPE_LABELS.length; i++) {
		controls.shapes.push(columnShapes.checkboxControls.add({ staticLabel: SHAPE_LABELS[i], checkedState: true }))
	}

	const result = dialog.show()

	if (result) {
		let selectedShaped: string[] = []
		for (let i: number = 0; i < controls.shapes.length; i++) {
			const checkbox = controls.shapes[i]
			if (checkbox.checkedState) {
				selectedShaped.push(SHAPE_LABELS_TO_OBJECT_TYPES[checkbox.staticLabel])
			}
		}
		alert(selectedShaped.toString())
		dialog.destroy()
	} else {
		dialog.destroy()
	}
}

main()
