import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  // {
  //   name: 'Dashboard',
  //   url: '/dashboard',
  //   iconComponent: { name: 'cil-speedometer' },
  //   badge: {
  //     color: 'info',
  //     text: 'NEW'
  //   }
  // },
  // {
  //   title: true,
  //   name: 'ToDo'
  // },
  {
    name: 'Today',
    url: '/dashboard',
    iconComponent: { name: 'cil-sun' },
  },
  {
    name: 'Important',
    url: '/important',
    iconComponent: { name: 'cil-star' },
  },
  {
    name: 'Planned',
    url: '/planned',
    iconComponent: { name: 'cil-spreadsheet' },
  },
  {
    name: 'All',
    url: '/alltasks',
    iconComponent: { name: 'cil-basket' },
  },
  {
    name: 'Completed',
    url: '/completed',
    iconComponent: { name: 'cil-check' },
  },
  {
    name: 'Tasks',
    url: '/tasks',
    iconComponent: { name: 'cil-home' },
  },
  {
    name: 'My Custom',
    url: '/mycustom',
    iconComponent: { name: 'cil-list' },
  },
];
