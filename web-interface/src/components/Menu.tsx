import { ICommandBarItemProps, CommandBar, Stack, Label } from "office-ui-fabric-react";
import React from "react";

export interface IMenuProps {
  login: string;
  querying: boolean;
  errorMessage?: string;
  onEditProfile: () => void;
  onLogOut: () => void;
  onClearError: () => void;
}

export const Menu = ({ login, onEditProfile, onLogOut, querying, errorMessage, onClearError }: IMenuProps) => {

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
            onClick: () => {
              onClearError();
              onEditProfile()
            }
          },
          {
            key: 'logOut',
            text: 'Выйти',
            iconProps: { iconName: 'SignOut' },
            onClick: () => {
              onClearError();
              onLogOut();
            }
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
        <div>
          {
            querying
            ?
              <Label>
                Идет запрос к серверу...
              </Label>
            :
              null
          }
          {
            errorMessage &&
            <Label>
              {`Ошибка на сервере: ${errorMessage}`}
            </Label>
          }
        </div>
      </Stack>
    </div>
  )
}