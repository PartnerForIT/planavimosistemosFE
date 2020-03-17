import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import * as React from 'react';
import { format } from 'date-fns';

const MTableGroupRow = ({
  columns, options, detailPanel, actions, groupData, groups, level, path, icons, ...props
}) => {
  const rotateIconStyle = (isOpen) => ({
    transform: isOpen ? 'rotate(90deg)' : 'none',
  });

  // render() {
  let colSpan = columns.filter((columnDef) => !columnDef.hidden).length;
  if (options.selection) colSpan += 1;
  if (detailPanel) colSpan += 1;
  if (actions && actions.length > 0) colSpan += 1;
  const column = groups[level];

  let detail;
  if (groupData.isExpanded) {
    if (groups.length > (level + 1)) { // Is there another group
      detail = groupData.groups.map((groupDataNew, index) => (
        <props.components.GroupRow
          actions={actions}
          key={groupData.value || (`${index}`)}
          columns={columns}
          components={props.components}
          detailPanel={detailPanel}
          getFieldValue={props.getFieldValue}
          groupData={groupDataNew}
          groups={groups}
          icons={icons}
          level={level + 1}
          path={[...path, index]}
          onGroupExpandChanged={props.onGroupExpandChanged}
          onRowSelected={props.onRowSelected}
          onRowClick={props.onRowClick}
          onToggleDetailPanel={props.onToggleDetailPanel}
          onTreeExpandChanged={props.onTreeExpandChanged}
          onEditingCanceled={props.onEditingCanceled}
          onEditingApproved={props.onEditingApproved}
          options={options}
          hasAnyEditingRow={props.hasAnyEditingRow}
          isTreeData={props.isTreeData}
        />
      ));
    } else {
      detail = groupData.data.map((rowData, index) => {
        if (rowData.tableData.editing) {
          return (
            <props.components.EditRow
              columns={columns}
              components={props.components}
              data={rowData}
              icons={icons}
              path={[...path, index]}
              localization={props.localization}
              key={index.toString()}
              mode={rowData.tableData.editing}
              options={options}
              isTreeData={props.isTreeData}
              detailPanel={detailPanel}
              onEditingCanceled={props.onEditingCanceled}
              onEditingApproved={props.onEditingApproved}
              getFieldValue={props.getFieldValue}
            />
          );
        }
        return (
          <props.components.Row
            actions={actions}
            key={index.toString()}
            columns={columns}
            components={props.components}
            data={rowData}
            detailPanel={detailPanel}
            getFieldValue={props.getFieldValue}
            icons={icons}
            path={[...path, index]}
            onRowSelected={props.onRowSelected}
            onRowClick={props.onRowClick}
            onToggleDetailPanel={props.onToggleDetailPanel}
            options={options}
            isTreeData={props.isTreeData}
            onTreeExpandChanged={props.onTreeExpandChanged}
            onEditingCanceled={props.onEditingCanceled}
            onEditingApproved={props.onEditingApproved}
            hasAnyEditingRow={props.hasAnyEditingRow}
          />
        );
      });
    }
  }

  const freeCells = [];
  for (let i = 0; i < level; i += 1) {
    freeCells.push(<TableCell padding='checkbox' key={i} />);
  }

  let { value } = groupData;
  if (column.lookup) {
    value = column.lookup[value];
  }

  let { title } = column;
  if (typeof options.groupTitle === 'function') {
    title = options.groupTitle(groupData);
  } else if (typeof title !== 'string') {
    title = React.cloneElement(title);
  }
  console.log('path', path);
  // const separator = props.options.groupRowSeparator || ': ';

  return (
    <>
      <TableRow style={{ backgroundColor: 'rgba(49, 156, 255, 0.1)', borderRadius: '6px' }}>
        {freeCells}
        <props.components.Cell
          style={{ color: '#4D7499' }}
          colSpan={colSpan}
          padding='none'
          columnDef={column}
          value={format(new Date(value), 'EEEE, dd, MMMM, Y')}
          icons={icons}
        >
          <IconButton
            style={{ transition: 'all ease 200ms', ...rotateIconStyle(groupData.isExpanded) }}
            onClick={() => {
              props.onGroupExpandChanged(path);
            }}
          >
            <icons.DetailPanel />
          </IconButton>
        </props.components.Cell>
      </TableRow>
      {detail}
    </>
  );
  // }
};

export default MTableGroupRow;
