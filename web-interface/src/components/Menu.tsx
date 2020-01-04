import { ICommandBarItemProps, Stack, CommandBar, Label } from "office-ui-fabric-react";
import React from "react";

export interface IMenuProps {
  isAdmin?: boolean;
  userName: string;
  querying: boolean;
  errorMessage?: string;
  onEditProfile: () => void;
  onGetCompanies?: () => void;
  onLogOut: () => void;
  onClearError: () => void;
  onCreateCompany: () => void;
}

export const Menu = ({ userName, onEditProfile, onLogOut, querying, errorMessage, onClearError, onCreateCompany, isAdmin, onGetCompanies }: IMenuProps) => {
  console.log(isAdmin);
  const _items: ICommandBarItemProps[] = [
    {
      key: 'newItem',
      iconProps: { iconName: 'Add' },
      subMenuProps: {
        items: [
          {
            key: 'addCompany',
            text: 'Создать организацию..',
            iconProps: { iconName: 'Org' },
            onClick: () => {
              onClearError();
              onCreateCompany();
            }
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
      text: userName,
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
            key: 'editProfile',
            text: 'Мои организации',
            iconProps: { iconName: 'Org' },
            disabled: !isAdmin,
            onClick: () => {
              onClearError();
              onGetCompanies && onGetCompanies()
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