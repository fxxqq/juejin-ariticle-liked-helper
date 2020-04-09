import { VariableSizeGrid as Grid } from 'react-window';
import ResizeObserver from 'rc-resize-observer';
import classNames from 'classnames';
import { Table } from 'antd';
import { TableProps } from 'antd/es/table'
import React, { useState, useEffect, useRef } from 'react';

interface VirtualTableProps extends TableProps {
  columns: Array<any>;
  scroll: any;
  className?: any;
}

const VirtualTable: React.FC<VirtualTableProps> = props => {
  const { columns, scroll, className } = props;
  const [tableWidth, setTableWidth] = useState(0);

  const widthColumnCount = columns.filter(({ width }) => !width).length;
  const mergedColumns = columns.map(column => {
    if (column.width) {
      return column;
    }

    return {
      ...column,
      width: Math.floor(tableWidth / widthColumnCount),
    };
  });

  const gridRef = useRef<any>();
  const [connectObject] = useState<any>(() => {
    const obj = {};
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => null,
      set: (scrollLeft: number) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({ scrollLeft });
        }
      },
    });

    return obj;
  });

  const resetVirtualGrid = () => {
    gridRef.current && gridRef.current.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: false,
    });
  };

  useEffect(() => resetVirtualGrid, []);
  useEffect(() => resetVirtualGrid, [tableWidth]);

  const renderVirtualList = (rawData: object[], { scrollbarSize, ref, onScroll }: any) => {
    ref.current = connectObject;

    return (
      <Grid
        ref={gridRef}
        className="virtual-grid"
        columnCount={mergedColumns.length}
        columnWidth={index => {
          const { width } = mergedColumns[index];
          return index === mergedColumns.length - 1 ? width - scrollbarSize - 1 : width;
        }}
        height={scroll.y}
        rowCount={rawData.length}
        rowHeight={() => 54}
        width={tableWidth}
        onScroll={({ scrollLeft }) => {
          onScroll({ scrollLeft });
        }}
      >
        {({ columnIndex, rowIndex, style }) => (
          <div
            className={classNames('virtual-table-cell', {
              'virtual-table-cell-last': columnIndex === mergedColumns.length - 1,
            })}
            style={style}
          >
            {rawData[rowIndex][mergedColumns[columnIndex].dataIndex]}
          </div>
        )}
      </Grid>
    );
  };


  return (
    <ResizeObserver onResize={({ width }) => {
      setTableWidth(width);
    }}>
      <Table
        {...props}
        className={classNames(className, 'virtual-table')}
        columns={mergedColumns}
        pagination={false}
        components={{
          body: renderVirtualList,
        }}
      />
    </ResizeObserver>
  );
};

export default VirtualTable;