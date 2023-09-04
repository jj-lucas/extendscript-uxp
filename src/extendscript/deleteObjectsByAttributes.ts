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
	const column = dialog.dialogColumns.add({})

	// keep a reference to the controls we will add
	let controls: {
		shapes: {
			checkbox: CheckboxControl
			name: string
		}[]
		colors: {
			checkbox: CheckboxControl
			name: string
			space: string
		}[]
	} = {
		shapes: [],
		colors: [],
	}

	// populate shapes
	const shapesRow = column.dialogRows.add({})
	const borderPanel = shapesRow.borderPanels.add({})
	borderPanel.staticTexts.add({ staticLabel: 'Shape:' })
	const columnShapes = borderPanel.dialogColumns.add({})
	for (let i: number = 0; i < SHAPE_LABELS.length; i++) {
		controls.shapes.push({
			checkbox: columnShapes.checkboxControls.add({ staticLabel: SHAPE_LABELS[i], checkedState: true }),
			name: SHAPE_LABELS_TO_OBJECT_TYPES[SHAPE_LABELS[i]],
		})
	}

	// populate colors
	const colors = app.activeDocument.colors
	if (colors.length) {
		const colorsRow = column.dialogRows.add({})
		const borderPanel = colorsRow.borderPanels.add({})
		borderPanel.staticTexts.add({ staticLabel: 'Color:' })
		const columnColors = borderPanel.dialogColumns.add({})
		for (let i: number = 0; i < colors.length; i++) {
			const color = colors[i]
			if (color.name) {
				// only show named colors
				const staticLabel = `${color.name} (${color.space})`
				controls.colors.push({
					checkbox: columnColors.checkboxControls.add({ staticLabel, checkedState: true }),
					name: color.name,
					space: color.space.toString(),
				})
			}
		}
	}

	const result = dialog.show()

	if (result) {
		let selectedShapes: string[] = []
		for (let i: number = 0; i < controls.shapes.length; i++) {
			const control = controls.shapes[i]
			if (control.checkbox.checkedState) {
				selectedShapes.push(control.name)
			}
		}

		dialog.destroy()
	} else {
		dialog.destroy()
	}
}

main()
