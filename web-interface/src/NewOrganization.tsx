import React, { useState } from 'react';
import { PrimaryButton, Stack, TextField } from 'office-ui-fabric-react';

export interface INewOrganizationProps {
  onSave: (name: string) => void;
}

export const NewOrganization = (props: INewOrganizationProps) => {
  const { onSave } = props;
  const [name, setName] = useState();

  return (
    <Stack horizontalAlign='center'>
      <div style={{width: '30vh', padding: '10px'}}>
        <TextField
          label="Наименование организации:"
          value={name}
          onChange={ (_, name) => setName(name) }
        />
        <div className="">
          <PrimaryButton
            text="Сохранить"
            style={{marginTop: '10px', float: 'right'}}
            disabled={!name}
            onClick={() => {
              onSave(name);
            }}
          />
        </div>
      </div>
    </Stack>
  )
}