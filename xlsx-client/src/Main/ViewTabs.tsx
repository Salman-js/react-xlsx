import React from 'react';
import { Tabs } from 'antd';
import ImportTable from '../tabs/tableFromImport';
import ImportCloudTable from '../tabs/tableFromServer';
import type { TabsProps } from 'antd';

const ViewTab: React.FC = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Upload`,
      children: <ImportTable />,
    },
    {
      key: '2',
      label: `View`,
      children: <ImportCloudTable />,
    },
  ];

  return <Tabs defaultActiveKey='1' items={items} />;
};

export default ViewTab;
