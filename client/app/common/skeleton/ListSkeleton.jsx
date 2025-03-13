import React from 'react'

const ListSkeleton = ({ isLoading, children, className = '' }) => {
    return (
        <>
            {isLoading && <div className={`fu-list-skeleton-container ${className} p-0`}>
                <div className='fu-list-skeleton'>
                    <div className="skeleton-item item3"></div>
                    <div className="skeleton-item item2"></div>
                    <div className="skeleton-item item1"></div>
                    <div className="skeleton-item item2"></div>
                    <div className="skeleton-item item1"></div>
                    <div className="skeleton-item item2"></div>
                    <div className="skeleton-item item3"></div>
                    <div className="skeleton-item item4"></div>
                    <div className="skeleton-item item2"></div>
                    <div className="skeleton-item item5"></div>
                    <div className="skeleton-item item4"></div>
                    <div className="skeleton-item item5"></div>
                    <div className="skeleton-item item3"></div>
                    <div className="skeleton-item item4"></div>
                    <div className="skeleton-item item6"></div>
                </div>
            </div>}
            {children}
        </>
    )
}

export default ListSkeleton