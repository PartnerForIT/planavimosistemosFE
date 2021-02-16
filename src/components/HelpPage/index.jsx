import React from 'react';
import MaynLayout from '../Core/MainLayout';
import TitleBlock from '../Core/TitleBlock';
import PeopleIcon from '../Icons/2Peple';

export default function HelpPage() {
  return (
    <MaynLayout>
      <TitleBlock
        title={"Help"}
      >
        <PeopleIcon />
      </TitleBlock>
    </MaynLayout>
  )
}