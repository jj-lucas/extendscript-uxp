import { ShowDocName } from './test'

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

	ShowDocName()
}

const SHAPE_LABELS = ['Rectangles', 'Polygons', 'Ellipses']
const SHAPE_LABELS_TO_OBJECT_TYPES: { [key: string]: string } = {
	Rectangles: 'Rectangle',
	Polygons: 'Polygon',
	Ellipses: 'Oval', // designers refer to them as ellipses
}

type Controls = {
	shapes: {
		checkbox: CheckboxControl
		name: string
	}[]
	colors: {
		checkbox: CheckboxControl
		name: string
		space: ColorSpace
	}[]
}

const showDialog = () => {
	// add a dialog
	const dialog = app.dialogs.add({ name: 'Select objects by attribute' })
	const column = dialog.dialogColumns.add({})

	// keep a reference to the controls we will add
	let controls: Controls = {
		shapes: [],
		colors: [],
	}

	// populate shapes
	const shapesRow = column.dialogRows.add({})
	const borderPanel = shapesRow.borderPanels.add({})
	borderPanel.staticTexts.add({ staticLabel: 'Shape:' })
	const shapesColumn = borderPanel.dialogColumns.add({})
	for (let i: number = 0; i < SHAPE_LABELS.length; i++) {
		controls.shapes.push({
			checkbox: shapesColumn.checkboxControls.add({ staticLabel: SHAPE_LABELS[i], checkedState: true }),
			name: SHAPE_LABELS_TO_OBJECT_TYPES[SHAPE_LABELS[i]],
		})
	}

	// populate colors
	const colors = app.activeDocument.colors
	if (colors.length) {
		const colorsRow = column.dialogRows.add({})
		const borderPanel = colorsRow.borderPanels.add({})
		borderPanel.staticTexts.add({ staticLabel: 'Color:' })
		const colorsColumn = borderPanel.dialogColumns.add({})
		for (let i: number = 0; i < colors.length; i++) {
			const color = colors[i]
			if (color.name) {
				// only show named colors
				const staticLabel = `${color.name} (${color.space})`
				controls.colors.push({
					checkbox: colorsColumn.checkboxControls.add({ staticLabel, checkedState: true }),
					name: color.name,
					space: color.space,
				})
			}
		}
	}

	const result = dialog.show()

	if (result) {
		selectObjects(controls)
		dialog.destroy()
	} else {
		dialog.destroy()
	}
}

const selectObjects = (controls: Controls) => {
	// prepare a list of selected shapes
	let selectedShapes: string[] = []
	for (let i: number = 0; i < controls.shapes.length; i++) {
		const control = controls.shapes[i]
		if (control.checkbox.checkedState) {
			selectedShapes.push(control.name)
		}
	}

	// prepare a list of selected colors, by color space
	const selectedColors: { [key: string]: string[] } = {}
	for (let i: number = 0; i < controls.colors.length; i++) {
		const control = controls.colors[i]
		const space = control.space.toString()
		if (control.checkbox.checkedState) {
			if (!selectedColors[space]) {
				selectedColors[space] = []
			}
			selectedColors[space].push(control.name)
		}
	}

	// find eligible items
	const objectsToSelect: PageItem[] = []
	const activeWindow = app.activeWindow as LayoutWindow
	const pageItems = activeWindow.activeSpread.allPageItems

	for (let i: number = 0; i < pageItems.length; i++) {
		const item = pageItems[i]
		// filter by matching shape
		if (inArray(item.constructor.name, selectedShapes)) {
			const fillColor = item.fillColor as Color
			// filter by matching fill color
			// disregard stroke color
			if (fillColor.hasOwnProperty('space') && inArray(fillColor.name, selectedColors[fillColor.space])) {
				objectsToSelect.push(item)
			}
		}
	}

	// select eligible items
	app.activeDocument.select(objectsToSelect)
}

const inArray = (stringToFind: string, arrayToSearch: string[]) => {
	let myResult = false
	if (arrayToSearch) {
		for (let i: number = 0; i < arrayToSearch.length; i++) {
			if (arrayToSearch[i] == stringToFind) {
				myResult = true
				break
			}
		}
	}
	return myResult
}

main()
