import React from 'react';
import MaynLayout from '../Core/MainLayout';
import TitleBlock from '../Core/TitleBlock';
import Dashboard from '../Core/Dashboard';
import SettingsBig from '../Icons/SettingsBig';

export default function HelpPage() {
  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title='Settings'
        >
          <SettingsBig />
        </TitleBlock>
      </Dashboard>
    </MaynLayout>
  );
}
