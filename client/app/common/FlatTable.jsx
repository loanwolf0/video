import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ListSkeleton from "./skeleton/ListSkeleton";
import PaginationSkeleton from "./skeleton/PaginationSkeleton";
import Nodata from "./Nodata";

const FlatTable = ({
    className = 'height-md',
    list = [],
    itemKey = (item) => item.key,
    columns = [],
    renderRow = () => <></>,

    // pagination
    hasMore = false,
    loader = false,
    scrollLoader = false,
    next = () => { },

    // sort
    onSort = () => { },
}) => {

    const scrollableTarget = useRef('scroll-' + new Date().getTime())

    const [tableColumns, setTableColumns] = useState([])

    const [sortColumn, setSortColumn] = useState(null)
    const [sortOrder, setSortOrder] = useState(null)

    useEffect(() => {
        setTableColumns(columns)
    }, [columns])

    const handleSort = (column) => {
        if (!column.canSort) return

        const _sortOrder = (sortColumn === column.id && sortOrder === 1) ? -1 : 1

        setSortColumn(column.id)
        setSortOrder(_sortOrder)
        onSort({ sortColumn: column.id, sortOrder: _sortOrder })
    }

    return (
        <div className={`fu-flat-table fu-scroll-body p-0 ${className}`} id={scrollableTarget.current}>
            <InfiniteScroll dataLength={list.length} hasMore={hasMore} next={next} scrollableTarget={scrollableTarget.current}>
                <table>
                    <thead className="fu-table-head">
                        <tr className='fu-head-row'>
                            {tableColumns.map((column) => (
                                <th className={`${column.canSort ? 'cursor-pointer' : ''} ${column.className ?? ''}`} key={column.id} onClick={() => handleSort(column)}>
                                    {column.name}
                                    {column.canSort &&
                                        <span className='header-sort'>
                                            <i className={`ph ph-arrow-up ${(sortColumn === column.id && sortOrder === 1) ? 'active' : ''}`}></i>
                                            <i className={`ph ph-arrow-down ${(sortColumn === column.id && sortOrder === -1) ? 'active' : ''}`}></i>
                                        </span>
                                    }
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loader
                            ? <tr><td colSpan={tableColumns.length}><ListSkeleton className="fu-scroll-body height-cstm-table" isLoading={loader} /></td></tr>
                            : <>
                                {list.length
                                    ? list.map((item, index) => (<tr className="fu-body-row" key={itemKey(item)}>{renderRow(item, index)}</tr>))
                                    : <tr><td colSpan={tableColumns.length} className={`fu-scroll-body ${className === 'height-sm' ? 'height-xs' : 'height-sm'}`}><Nodata /></td></tr>
                                }
                            </>
                        }
                        {scrollLoader && <tr><td colSpan={tableColumns.length}><PaginationSkeleton /></td></tr>}
                    </tbody>
                </table>
            </InfiniteScroll>
        </div>
    )
}

export default FlatTable;