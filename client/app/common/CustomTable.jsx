import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { TABLE } from '../constants/table.constant'
import axios from 'axios'
import OutsideClickHandler from './OutsideClickHandler'
import InfiniteScroll from 'react-infinite-scroll-component'
import ListSkeleton from './skeleton/ListSkeleton'
import Loader from './Loader'
import PaginationSkeleton from './skeleton/PaginationSkeleton'
import { useAsyncDebounce } from '../../hooks/debounce'
import SortableList, { arrayMove } from './SortableList'
import Dropdown from './Dropdown'
import Nodata from './Nodata'
import Tooltip from './Tooltip'

const CustomTable = ({
	id,
	className = '',
	list = [],
	itemKey = (item) => item.key,
	renderOptions = ({ optionButton }) => <div className='d-flex justify-content-end'>{optionButton}</div>,
	renderRow = () => ({}),
	renderActions,
	hideNoData,

	// pagination
	hasMore = false,
	loader = false,
	scrollLoader = false,
	next = () => { },

	// checkbox
	enableSelection = false,
	totalCount, // required, in case of enableSelection: true
	onSelect = () => { },

	// sort
	onSort = () => { },
}, ref) => {

	const table = useRef(TABLE[id])
	const scrollableTarget = useRef('scroll-' + new Date().getTime())
	const tableContainer = useRef()
	const columnResizerPin = useRef()
	const columnResizer = useRef({
		clientRect: null,
		firstX: null,
		target: null,
		columnName: null,
		rightPosition: -4,
		distance: 0,
	})

	const [fixedColumnNames, setFixedColumnNames] = useState([])
	const [columnNames, setColumnNames] = useState([])
	const [fixedColumns, setFixedColumns] = useState({})
	const [columns, setColumns] = useState({})
	const [tablePreference, setTablePreference] = useState({})

	const [shiftSelected, setShiftSelected] = useState(false);
	const [isSelectAll, setIsSelectAll] = useState(false);
	const [selectedItems, setSelectedItems] = useState([]);
	const [deselectedItems, setDeselectedItems] = useState([]);

	const [sortColumn, setSortColumn] = useState(null)
	const [sortOrder, setSortOrder] = useState(null)

	const [isLoading, setIsLoading] = useState(false)

	const [isOpenOptionModal, setIsOpenOptionModal] = useState(false)

	useEffect(() => {
		getTablePreference()
		window.addEventListener('keydown', keydown);
		window.addEventListener('keyup', onkeyup);
		window.addEventListener('custom-table', listenTableUpdates);
		return () => {
			window.removeEventListener('keydown', keydown, false);
			window.removeEventListener('keyup', onkeyup, false);
			window.removeEventListener('custom-table', listenTableUpdates, false);
		}
	}, [])

	useImperativeHandle(ref, () => ({
		resetSelection: handleResetSelection,
	}))

	const listenTableUpdates = (event) => {
		if (event.detail.tableId === id) {
			setTablePreference(event.detail.tablePreference)
			setFixedColumns(event.detail.tablePreference.fixedColumns.reduce((arr, v) => ({ ...arr, [v.id]: v }), {}))
			setColumns(event.detail.tablePreference.columns.reduce((arr, v) => ({ ...arr, [v.id]: v }), {}))
			setFixedColumnNames(event.detail.tablePreference.fixedColumns.map(column => column.id))
			setColumnNames(event.detail.tablePreference.columns.map(column => column.id))
		}
	}

	const keydown = (e) => {
		if (e.key === 'Shift') setShiftSelected(true);
	}

	const onkeyup = (e) => {
		if (e.key === 'Shift') setShiftSelected(false);
	}

	const handleResetSelection = () => {
		setDeselectedItems([])
		setSelectedItems([])
		setIsSelectAll(false)
	}

	const getTablePreference = async () => {
		try {
			setIsLoading(true);
			const response = await axios({
				url: `/api/common/user-preference/table/${id}`,
				method: 'GET'
			})
			// Currently, `fixedColumns` and `columns` reference the `tablePreference` state, so whenever `tablePreference` changes, `fixedColumns` and `columns` also change.
			setTablePreference(response.data.table)
			setFixedColumns(response.data.table.fixedColumns.reduce((arr, v) => ({ ...arr, [v.id]: v }), {}))
			setColumns(response.data.table.columns.reduce((arr, v) => ({ ...arr, [v.id]: v }), {}))
			setFixedColumnNames(response.data.table.fixedColumns.map(column => column.id))
			setColumnNames(response.data.table.columns.map(column => column.id))

			setIsLoading(false);
		} catch (error) {
			console.error(error)
		}
	}

	const updateTablePreference = async (_tablePreference = tablePreference) => {
		try {
			await axios({
				url: `/api/common/user-preference/table/${id}`,
				method: 'POST',
				data: {
					table: _tablePreference,
				}
			})
			window.dispatchEvent(new CustomEvent('custom-table', { detail: { tableId: id, tablePreference: _tablePreference } }))

		} catch (error) {
			console.error(error)
		}
	}

	const tableDebounce = useAsyncDebounce(updateTablePreference, 500)

	const handleStartResizing = (e, columnName) => {
		e.stopPropagation()
		e.preventDefault()
		columnResizer.current.target = e.target;
		columnResizer.current.clientRect = e.target.getBoundingClientRect();
		columnResizer.current.firstX = e.clientX || e.touches[0].clientX;
		columnResizer.current.columnName = columnName;
		const tableClientRect = tableContainer.current.getBoundingClientRect()
		columnResizerPin.current.style.display = 'block'
		columnResizerPin.current.style.height = tableClientRect.height + 'px'
		columnResizerPin.current.style.top = tableClientRect.top + 'px'
		columnResizerPin.current.style.left = (columnResizer.current.clientRect.left + 2) + 'px'

		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
		document.addEventListener('touchmove', handleMouseMove)
		document.addEventListener('touchend', handleMouseUp)
	}

	const handleMouseMove = (e) => {
		const columnMetaData = table.current.COLUMNS[columnResizer.current.columnName]
		const column = columns[columnResizer.current.columnName] || fixedColumns[columnResizer.current.columnName]

		const clientX = e.clientX || e.touches[0].clientX;
		let distance = clientX - columnResizer.current.firstX;
		if (distance + column.width < columnMetaData.minWidth) {
			distance = columnMetaData.minWidth - column.width
		}
		if (distance + column.width > columnMetaData.maxWidth) {
			distance = columnMetaData.maxWidth - column.width
		}

		let right = columnResizer.current.rightPosition - distance;
		let pinRight = (columnResizer.current.clientRect.left + distance);
		columnResizer.current.target.style.right = right + 'px'
		columnResizerPin.current.style.left = (pinRight + 2) + 'px'
		columnResizer.current.target.style.setProperty('border-color', 'darkblue', 'important');
		columnResizer.current.distance = distance
	}

	const handleMouseUp = (e) => {
		// Capture the current values of columnName and distance
		const { columnName, distance } = columnResizer.current;

		setTablePreference(old => {
			return {
				...old,
				fixedColumns: old.fixedColumns.map(column => {
					if (column.id === columnName) column.width = column.width + distance;
					return column
				}),
				columns: old.columns.map(column => {
					if (column.id === columnName) column.width = column.width + distance;
					return column
				})
			};
		})

		columnResizer.current.target.style.setProperty('border-color', 'transparent');
		columnResizer.current.target.style.right = columnResizer.current.rightPosition + 'px';
		columnResizer.current.target = null
		columnResizer.current.clientRect = null
		columnResizer.current.firstX = null
		columnResizer.current.columnName = null
		columnResizer.current.distance = 0
		columnResizerPin.current.style.display = 'none'

		document.removeEventListener('mousemove', handleMouseMove, false)
		document.removeEventListener('mouseup', handleMouseUp, false)
		document.removeEventListener('touchmove', handleMouseMove, false)
		document.removeEventListener('touchend', handleMouseUp, false)
		tableDebounce()
	}

	const handleSortableColumn = (moveFrom, moveTo) => {
		const _columnNames = arrayMove(columnNames, moveFrom, moveTo);
		setColumnNames(_columnNames);
		setTablePreference(old => {
			old.columns = _columnNames.map(columnName => old.columns.find(col => col.id === columnName))
			return old
		})

		tableDebounce()
	}

	const handleColumnVisibility = (e, columnName) => {
		setColumns(old => {
			old[columnName].isHide = !e.target.checked
			return { ...old }
		})
		setTablePreference(old => {
			old.columns = old.columns.map(column => {
				if (column.id === columnName) column.isHide = !e.target.checked
				return column
			})
			return old
		})

		tableDebounce()
	}

	const handleColumnFixed = (columnName) => {
		const columnIndex = columnNames.indexOf(columnName);
		const _columnNames = [...columnNames]
		_columnNames.splice(columnIndex, 1);
		_columnNames.unshift(fixedColumnNames[0])
		const _fixedColumnNames = [columnName];

		const _tablePreferenceColumns = [...tablePreference.columns]
		const _tablePreferenceFixedColumns = [_tablePreferenceColumns.splice(columnIndex, 1)[0]];
		_tablePreferenceColumns.unshift(tablePreference.fixedColumns[0])
		const _tablePreference = {
			...tablePreference,
			fixedColumns: _tablePreferenceFixedColumns,
			columns: _tablePreferenceColumns,
		}

		const _columns = { ...fixedColumns, ...columns }
		const _fixedColumns = { [columnName]: _columns[columnName] }
		delete _columns[columnName]

		setColumnNames(_columnNames)
		setFixedColumnNames(_fixedColumnNames)
		setColumns(_columns)
		setFixedColumns(_fixedColumns)
		setTablePreference(_tablePreference)

		tableDebounce(_tablePreference)
	}

	const handleSelectAll = (event) => {
		setIsSelectAll(event.target.checked);
		setSelectedItems([])
		setDeselectedItems([])
		if (onSelect instanceof Function) onSelect({ deselectedItems: [], selectedItems: [], isSelectAll: event.target.checked })
	}

	const handleSelectItem = (isChecked, item) => {
		let _deselectedItems = deselectedItems, _selectedItems = selectedItems, _isSelectAll = isSelectAll;

		if (_isSelectAll) {
			if (isChecked) {
				_deselectedItems = deselectedItems.filter(id => id !== item)
			} else if ((deselectedItems.length + 1) === totalCount) {
				_isSelectAll = false
				_selectedItems = []
				_deselectedItems = []
			} else {
				_deselectedItems = [...deselectedItems, item]
			}
		} else if (isChecked) {
			_selectedItems = [..._selectedItems, item]
			if ((selectedItems.length + 1) === totalCount) _isSelectAll = true
		} else {
			_isSelectAll = false
			_selectedItems = _selectedItems.filter(id => id !== item)
		}

		if (shiftSelected) {
			if (selectedItems.length && !_isSelectAll) {
				const start = selectedItems[selectedItems.length - 1];
				const end = item;
				let _check = false
				let startIndex, endIndex

				list.forEach((_item, index) => {
					if (itemKey(_item) === start || itemKey(_item) === end) {
						if (_check) {
							endIndex = index
							_check = false
						} else {
							startIndex = index
							_check = true
						}
					}
				})

				_selectedItems.pop()
				if (isChecked) {
					list.slice(startIndex, endIndex).forEach((_item) => {
						if (!_selectedItems.includes(itemKey(_item))) _selectedItems.push(itemKey(_item))
					})
					_selectedItems.push(item)
				} else {
					list.slice(startIndex, endIndex).forEach((_item) => {
						if (_selectedItems.includes(itemKey(_item))) {
							const index = _selectedItems.indexOf(itemKey(_item));
							if (index > -1) _selectedItems.splice(index, 1);
						}
					})
				}
			}

			if (deselectedItems.length && _isSelectAll) {
				const start = deselectedItems[deselectedItems.length - 1];
				const end = item;
				let _check = false
				let startIndex, endIndex

				list.forEach((_item, index) => {
					if (itemKey(_item) === start || itemKey(_item) === end) {
						if (_check) {
							endIndex = index
							_check = false
						} else {
							startIndex = index
							_check = true
						}
					}
				})

				_deselectedItems.pop()
				if (isChecked) {
					list.slice(startIndex, endIndex).forEach((_item) => {
						if (_deselectedItems.includes(itemKey(_item))) {
							const index = _deselectedItems.indexOf(itemKey(_item));
							if (index > -1) _deselectedItems.splice(index, 1);
						}
					})
				} else {
					list.slice(startIndex, endIndex).forEach((_item) => {
						if (!_deselectedItems.includes(itemKey(_item))) _deselectedItems.push(itemKey(_item))
					})
					_deselectedItems.push(item)
				}
			}
		}

		if (onSelect instanceof Function) onSelect({ deselectedItems: _deselectedItems, selectedItems: _selectedItems, isSelectAll: _isSelectAll })
		setIsSelectAll(_isSelectAll)
		setSelectedItems(_selectedItems)
		setDeselectedItems(_deselectedItems)
	}

	const handleSort = (sortColumn, sortOrder) => {
		setSortColumn(sortColumn)
		setSortOrder(sortOrder)
		onSort({ sortColumn, sortOrder })
	}

	const handleColumnAdjustments = (action, columnName) => {
		switch (action) {
			case "right": {
				const indexOf = columnNames.indexOf(columnName)
				const _columnNames = arrayMove(columnNames, indexOf, indexOf + 1);
				setColumnNames(_columnNames);
				setTablePreference(old => {
					old.columns = _columnNames.map(columnName => old.columns.find(col => col.id === columnName))
					return old
				})
				break;
			}
			case "left": {
				const indexOf = columnNames.indexOf(columnName)
				const _columnNames = arrayMove(columnNames, indexOf, indexOf - 1);
				setColumnNames(_columnNames);
				setTablePreference(old => {
					old.columns = _columnNames.map(columnName => old.columns.find(col => col.id === columnName))
					return old
				})
				break;
			}
			case "narrow": {
				setTablePreference(old => {
					return {
						...old,
						fixedColumns: old.fixedColumns.map(column => {
							if (column.id === columnName) column.width = table.current.COLUMNS[columnName].minWidth;
							return column
						}),
						columns: old.columns.map(column => {
							if (column.id === columnName) column.width = table.current.COLUMNS[columnName].minWidth;
							return column
						})
					};
				})
				break;
			}
			case "wide": {
				setTablePreference(old => {
					return {
						...old,
						fixedColumns: old.fixedColumns.map(column => {
							if (column.id === columnName) column.width = table.current.COLUMNS[columnName].maxWidth;
							return column
						}),
						columns: old.columns.map(column => {
							if (column.id === columnName) column.width = table.current.COLUMNS[columnName].maxWidth;
							return column
						})
					};
				})
				break;
			}
			case "hide": {
				setColumns(old => {
					old[columnName].isHide = true
					return { ...old }
				})
				setTablePreference(old => {
					old.columns = old.columns.map(column => {
						if (column.id === columnName) column.isHide = true
						return column
					})
					return old
				})
				break;
			}
		}
		tableDebounce()
	}

	const handleStopDragging = (e) => {
		e.stopPropagation()
		e.preventDefault()
	}

	const handleColumnSort = (columnName) => {
		if (!table.current.COLUMNS[columnName].canSort) return

		handleSort(columnName, (sortColumn === columnName && sortOrder === 1) ? -1 : 1)
	}

	const optionButton =
		<Tooltip message={'customize'} position='bottom'>
			<button className='icon-btn-sm icon-btn-primary-light' onClick={() => setIsOpenOptionModal(true)}>
				<i className="ph ph-faders-horizontal"></i>
			</button>
		</Tooltip>

	return (
		<Loader extraClass="fu-loading-body" isLoading={isLoading}>
			{renderOptions({ optionButton })}
			<div className={className}>
				<div className='fu-cstm-table'>
					<div ref={tableContainer} className={`table-container ${loader ? 'disable' : ''}`} id={scrollableTarget.current}>
						<div ref={columnResizerPin} className='resizer-pin'></div>
						<InfiniteScroll dataLength={list.length} hasMore={hasMore} next={next} scrollableTarget={scrollableTarget.current}>
							<div className="table-header">
								<SortableList
									list={columnNames}
									itemKey={item => item}
									onChange={handleSortableColumn}
									renderList={({ props, children }) => <div className='header-flex' {...props}>
										{fixedColumnNames.map(col => <div className='sticky' key={'col-header-' + col} style={{ width: fixedColumns[col]?.width + 'px' }}>
											<div onClick={() => { handleColumnSort(col) }} className={`header-cell ${table.current.COLUMNS[col].canSort ? 'cursor-pointer' : ''}`}>
												<div className='d-flex gap-20'>
													{enableSelection && <div onClick={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
														<label className=" checkbox checkbox--md">
															<input type="checkbox" disabled={totalCount === 0} checked={isSelectAll && deselectedItems.length === 0} onChange={handleSelectAll} />
															<span className="checkmark checkmark--md"></span>
														</label>
													</div>
													}
													<div>
														<span className='me-2'>{table.current.COLUMNS[col].name}</span>
														{table.current.COLUMNS[col].canSort &&
															<span className='header-sort'>
																<i className={`ph ph-arrow-up ${(sortColumn === col && sortOrder === 1) ? 'active' : ''}`}></i>
																<i className={`ph ph-arrow-down ${(sortColumn === col && sortOrder === -1) ? 'active' : ''}`}></i>
															</span>
														}
													</div>
												</div>
												<Dropdown.Container
													closeOnClick
													onClick={handleStopDragging}
													toggle={<i className="ph ph-caret-down"></i>}
												>
													{table.current.COLUMNS[col].canSort && <>
														{sortColumn !== col && <Dropdown.Item onClick={() => { handleSort(col, 1) }}>
															<i className="ph ph-sort-ascending"></i> Sort Ascending
														</Dropdown.Item>}
														{sortColumn !== col && <Dropdown.Item onClick={() => { handleSort(col, -1) }}>
															<i className="ph ph-sort-descending"></i> Sort Descending
														</Dropdown.Item>}
														{sortColumn === col && <Dropdown.Item onClick={() => { handleSort(null, null) }}>
															Clear Sorting
														</Dropdown.Item>}
														{sortColumn === col && <Dropdown.Item onClick={() => { handleSort(col, sortOrder === 1 ? -1 : 1) }}>
															Reverse Sort Order
														</Dropdown.Item>}
													</>}
													<Dropdown.Item onClick={() => { handleColumnAdjustments('narrow', col) }}>
														Column Width Narrow
													</Dropdown.Item>
													<Dropdown.Item onClick={() => { handleColumnAdjustments('wide', col) }}>
														Column Width Wide
													</Dropdown.Item>
												</Dropdown.Container>
												<div onTouchStart={(e) => handleStartResizing(e, col)} onMouseDown={(e) => handleStartResizing(e, col)} className='resizer'></div>
											</div>
										</div>)}
										{children}
									</div>}
									renderCondition={col => !columns[col]?.isHide}
									renderItem={(col, index) => {
										return <div key={'col-header-' + col} style={{ width: (columns[col]?.width - 1) + 'px' }}>
											<div onClick={() => { handleColumnSort(col) }} className={`header-cell ${table.current.COLUMNS[col].canSort ? 'cursor-pointer' : 'cursor-grab'}`} >
												<div>
													<span className='me-2'>{table.current.COLUMNS[col].name}</span>
													{table.current.COLUMNS[col].canSort &&
														<span className='header-sort'>
															<i className={`ph ph-arrow-up ${(sortColumn === col && sortOrder === 1) ? 'active' : ''}`}></i>
															<i className={`ph ph-arrow-down ${(sortColumn === col && sortOrder === -1) ? 'active' : ''}`}></i>
														</span>
													}
												</div>
												<Dropdown.Container
													closeOnClick
													draggable
													onClick={handleStopDragging}
													onDragStart={handleStopDragging}
													onTouchStart={handleStopDragging}
													toggle={<i className="ph ph-caret-down"></i>}
												>
													{table.current.COLUMNS[col].canSort && <>
														{sortColumn !== col && <Dropdown.Item onClick={() => { handleSort(col, 1) }}>
															<i className="ph ph-sort-ascending"></i> Sort Ascending
														</Dropdown.Item>}
														{sortColumn !== col && <Dropdown.Item onClick={() => { handleSort(col, -1) }}>
															<i className="ph ph-sort-descending"></i> Sort Descending
														</Dropdown.Item>}
														{sortColumn === col && <Dropdown.Item onClick={() => { handleSort(null, null) }}>
															Clear Sorting
														</Dropdown.Item>}
														{sortColumn === col && <Dropdown.Item onClick={() => { handleSort(col, sortOrder === 1 ? -1 : 1) }}>
															Reverse Sort Order
														</Dropdown.Item>}
													</>}
													{index !== 0 && <Dropdown.Item onClick={() => { handleColumnAdjustments('left', col) }}>
														Move Left
													</Dropdown.Item>}
													{index !== columnNames.length - 1 && <Dropdown.Item onClick={() => { handleColumnAdjustments('right', col) }}>
														Move Right
													</Dropdown.Item>}
													<Dropdown.Item onClick={() => { handleColumnAdjustments('narrow', col) }}>
														Column Width Narrow
													</Dropdown.Item>
													<Dropdown.Item onClick={() => { handleColumnAdjustments('wide', col) }}>
														Column Width Wide
													</Dropdown.Item>
													<Dropdown.Item onClick={() => { handleColumnAdjustments('hide', col) }}>
														Hide Column
													</Dropdown.Item>
												</Dropdown.Container>
												<div onTouchStart={(e) => handleStartResizing(e, col)} onMouseDown={(e) => handleStartResizing(e, col)} className='resizer'></div>
											</div>
										</div>
									}}
								/>
								<div className='empty-cell' />
							</div>
							<div className='table-body'>
								<ListSkeleton className="fu-scroll-body height-cstm-table" isLoading={loader}>
									{!list.length && !hideNoData && <div className='fu-scroll-body height-xs'><Nodata /></div>}
									{list.map(item => <div className='d-flex' key={itemKey(item)}>
										<div className='table-body-row'  >
											{fixedColumnNames.map(col => <div className='sticky' key={'col-cell-' + col} style={{ width: fixedColumns[col]?.width + 'px' }}>
												<div className='d-flex gap-20'>
													{enableSelection && <label className=" checkbox checkbox--md">
														<input
															type="checkbox"
															onChange={(e) => { handleSelectItem(e.target.checked, itemKey(item)) }}
															checked={(selectedItems.includes(itemKey(item)) && !isSelectAll) || (!deselectedItems.includes(itemKey(item)) && isSelectAll)}
														/>
														<span className="checkmark checkmark--md"></span>
													</label>}
													{renderRow(item)[col]}
												</div>
												{renderActions?.(item)}
											</div>)}
											{columnNames.map(col => {
												if (columns[col]?.isHide) return <React.Fragment key={col}></React.Fragment>
												return <div className={`${table.current.COLUMNS[col].className ?? ''}`} key={'col-cell-' + col} style={{ width: columns[col]?.width + 'px' }}>
													{renderRow(item)[col]}
												</div>
											})}
										</div>
										<div className='empty-cell' />
									</div>)}
								</ListSkeleton>
							</div>
						</InfiniteScroll>
						{scrollLoader && <PaginationSkeleton />}
					</div>

					{isOpenOptionModal && <OutsideClickHandler callback={() => { setIsOpenOptionModal(false) }}>
						<div className='option-modal card p-0'>
							<div className='p-3 gap-20 d-flex justify-content-between fu-content-head fu-content-bg  filter-header'>
								<span className='font-size-20'>
									Customize
								</span>
								<button className='fu-btn fu-btn--secondary fu-btn-sm' onClick={() => { setIsOpenOptionModal(false) }}>
									<i className="ph ph-arrow-line-right"></i>
								</button>
							</div>
							<div className='p-2'>
								{/* <span className='pb-2'>Fixed Column</span> */}
								<div>
									{fixedColumnNames.map(col => <div className='d-flex justify-content-between p-2 gap-60  mb-2  radius-4 fu-btn--secondary fu-btn  ' key={'option-fixed-col-' + col}>
										{table.current.COLUMNS[col].name}
										<i className="ph-fill ph-lock "></i>
									</div>)}
								</div>
								{/* <div className='mt-2'>Columns</div> */}
								<SortableList
									list={columnNames}
									itemKey={item => item}
									onChange={handleSortableColumn}
									renderItem={(col) => (
										<div className='d-flex justify-content-between p-2 gap-60 card mb-2 border-grey radius-4 fu-btn--secondary fu-btn ' key={'option-col-' + col}>
											<span className='d-flex align-items-center gap-4'>
												<i className="ph ph-dots-six-vertical me-2"></i>
												{table.current.COLUMNS[col].name}
											</span>
											<div className='d-flex align-items-center'>
												{table.current.COLUMNS[col].canFixed && <button className='pe-2 d-flex align-items-center ' onClick={(e) => handleColumnFixed(col)}>
													<i className="ph ph-lock-open text-primary"></i>
												</button>}
												<div className="switch-wrap  p-0">
													<label className="switch-group">
														<div className="switch switch--md">
															<input type="checkbox" checked={!columns[col]?.isHide} onChange={(e) => handleColumnVisibility(e, col)} />
															<span className="slider round"></span>
														</div>
													</label>
												</div>
											</div>
										</div>
									)}
								/>
							</div>
						</div>
					</OutsideClickHandler>}
				</div>
			</div>
		</Loader>
	)
}

export default forwardRef(CustomTable)