import { ICommandBarItemProps, CommandBar, Stack } from "office-ui-fabric-react";
import React from "react";

export interface IMenuProps {
  login: string;
  onEditProfile: () => void;
}

export const Menu = (props: IMenuProps) => {
  const { login, onEditProfile } = props;

  const _items: ICommandBarItemProps[] = [
    {
      key: 'newItem',
      iconProps: { iconName: 'Add' },
      subMenuProps: {
        items: [
          {
            key: 'addOrganization',
            text: 'Создать организацию..',
            iconProps: { iconName: 'Org' },
          },
          {
            key: 'something',
            text: 'Что-то еще..',
            iconProps: { iconName: 'AddReaction' }
          }
        ]
      }
    },
    {
      key: 'settings',
      text: login,
      subMenuProps: {
        items: [
          {
            key: 'editProfile',
            text: 'Редактировать профиль..',
            iconProps: { iconName: 'Settings' },
            onClick: () => onEditProfile()
          },
          {
            key: 'logOut',
            text: 'Выйти',
            iconProps: { iconName: 'SignOut' }
          }
        ]
      }
    }
  ];

  return (
    <div style={{height: '44px', padding: '8px', borderBottom: '1px solid #dadce0'}}>
      <Stack horizontalAlign='end'>
        <CommandBar
          items={_items}
        />
      </Stack>
    </div>
  )
}