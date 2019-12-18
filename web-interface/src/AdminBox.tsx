import React from 'react';
import { Label, PrimaryButton, Stack, StackItem, Pivot, PivotItem, CommandBar, getTheme, ICommandBarItemProps } from 'office-ui-fabric-react';
import { Frame } from './Frame';

export interface IAdminBoxProps {
  userName: string;
  organizations: string[];
  onClickEditProfile: () => void;
}

const theme = getTheme();



export const AdminBox = (props: IAdminBoxProps) => {
  const {onClickEditProfile, userName} = props;

  const _items: ICommandBarItemProps[] = [
    {
      key: 'newItem',
     // text: 'Новый',
    //  cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
      iconProps: { iconName: 'Add' },
      subMenuProps: {
        items: [
          {
            key: 'addOrganization',
            text: 'Создать организацию..',
            iconProps: { iconName: 'Org' },
            //['data-automation-id']: 'newEmailButton' // optional
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
     // cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
   //   iconProps: { iconName: 'Settings' },
      subMenuProps: {
        items: [
          {
            key: 'editProfile',
            text: 'Редактировать профиль..',
            iconProps: { iconName: 'Settings' },
           // ['data-automation-id']: 'newEmailButton' // optional
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
    <div style={{height: '50px', backgroundColor: theme.palette.themePrimary}}>
      <Stack horizontalAlign='end'>

        <CommandBar styles={{root: {backgroundColor: theme.palette.themePrimary}}}
          items={_items}
          // overflowItems={_overflowItems}
          // overflowButtonProps={overflowProps}
          // farItems={_farItems}
          // ariaLabel="Use left and right arrow keys to navigate between commands"
        />

      </Stack>
    </div>




    // <Stack horizontalAlign='start' styles={{root: {marginLeft: '5vh'}}}>
    //   <Frame border subTitle="Пользователь" marginBottom marginTop>

    //       <StackItem align='start'  styles={{root: {width: '25vh'}}}>
    //         <Label style={{fontSize: '20px'}}>{userName}</Label>
    //         <PrimaryButton
    //           text='Редактировать профиль'
    //           onClick={onClickEditProfile}>
    //         </PrimaryButton>
    //       </StackItem>
    //   </Frame>
    //   <Frame border subTitle="Организации" marginTop>


    //       <StackItem styles={{root: {width: '25vh'}}}>
    //         <Label>Организации1</Label>
    //         <Label>Организации2</Label>
    //         <Label>Организации3</Label>
    //       </StackItem>

    //   </Frame>
    // </Stack>
  )
}