import React, { useRef, useState } from 'react';
import { IColumn, DetailsList, SelectionMode, Stack, PrimaryButton, Selection } from 'office-ui-fabric-react';
import { IItem, IDevice } from '../types';

export interface IDeviceListProps {
  devices: IDevice[];
  onRemoveDevices?: (uIds: string[]) => void;
  onBlockDevices?:  (uIds: string[], isUnBlock?: boolean) => void;
  onClearError?: () => void;
}

export const DeviceList = ({ devices, onClearError, onRemoveDevices, onBlockDevices }: IDeviceListProps) => {
  const [selectedItems, setSelectedItems] = useState([] as string[]);
  const selection = useRef(new Selection({
    onSelectionChanged: () => {
      const newSelection = selection.current.getSelection().map( s => s.key ).filter( s => typeof s === 'string' ) as typeof selectedItems;
      setSelectedItems(newSelection);
    }
  }));
  const deviceItems: IItem[] = devices.map(d => ({key: d.uid, name: d.uid, state: d.state})) || [];
  const deviceColumns: IColumn[] = [{
    key: 'deviceName',
    name: 'Устройство',
    minWidth: 300,
    fieldName: 'name',
  },
  {
    key: 'deviceStatus',
    name: 'Статус',
    minWidth: 100,
    fieldName: 'state',
  }];

  return (
    <Stack>
      <Stack.Item>
        <DetailsList
          items={deviceItems}
          columns={deviceColumns}
          isHeaderVisible={true}
          selectionMode={SelectionMode.multiple}
          selection={selection.current}
          setKey="set"

        />
      </Stack.Item>
      <Stack.Item styles={{root: {paddingTop: '10px'}}}>
        { onRemoveDevices && onClearError && !!selectedItems.length &&
          <PrimaryButton
            text="Удалить"
            style={{marginLeft: '10px', float: 'right'}}
            disabled={!onRemoveDevices}
            onClick={() => {
              onClearError();
              onRemoveDevices(selectedItems);
              selection.current.setAllSelected(false);
            }}
          />
        }
        { onBlockDevices && onClearError && !!selectedItems.length &&
          <PrimaryButton
            text="Заблокировать"
            style={{marginLeft: '10px', float: 'right'}}
            onClick={() => {
              onClearError();
              onBlockDevices(selectedItems);
              selection.current.setAllSelected(false);
            }}
          />
        }
        { onBlockDevices && onClearError && !!selectedItems.length &&
          <PrimaryButton
            text="Разблокировать"
            style={{float: 'right'}}
            onClick={() => {
              onClearError();
              onBlockDevices(selectedItems, true);
              selection.current.setAllSelected(false);
            }}
          />
        }
        </Stack.Item>

    </Stack>
  )
}