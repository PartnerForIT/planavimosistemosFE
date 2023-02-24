/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(() => ({
  root: {
    width: '34px',
    height: '34px',
  },
}));

export default function MarkerIcon({ className, on = false }) {
  const classes = useStyles();
  return (
    !on ?
    <SvgIcon width='72' height='72' viewBox='0 0 72 72' className={classnames(classes.root, className)}>
      <defs>
        <pattern id='markeroff' preserveAspectRatio='none' width='100%' height='100%' viewBox='0 0 72 72'>
          <image width='72' height='72' xlinkHref='data:image/png;base64,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' />
        </pattern>
      </defs>
      <rect id='markericon' width='72' height='72' fill='url(#markeroff)' />
    </SvgIcon>
    :
    <SvgIcon width='72' height='72' viewBox='0 0 72 72' className={classnames(classes.root, className)}>
      <defs>
        <pattern id='markeron' preserveAspectRatio='none' width='100%' height='100%' viewBox='0 0 72 72'>
          <image width='72' height='72' xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAABHNCSVQICAgIfAhkiAAABYZJREFUeF7tnHlsFFUcx79TWqgcilpFEdFQKHKIlMopRgRBBTEIXhjEK4SkGmKjkSZqrAmKJWKMwYMgaT2oUFEK+EcxMQQPDkUDxnKlaMAWpNYDLAr0GL+/ThbabXd3pjNvujt9L5lsdve9mfl99je/6719BsLbInMMDDzCjwfxGMzj4hZ9gvXBHxRnT+NhohDPGdubimecfZNnpiIZLxLOU/ysU7AY2Jamnj1fRRqex3yjVkZZgF4yh5FeMd8NtH2qIHc0sZss5uJZ48cQoFco78Igy9wG2fIJKNfAy+ZYNOBrEktqw0mCO8QkFQOZBh+vdyjl/OBK6kqy5QJIrPZoV6cJ7uAtAuhvyndBcGV0JdkxAWS6OkXAB2tAMX5gDUgDcmcDtAZpDdIa5I6A1iB3/LQN0hqkNcgdAa1B7vglrA3qxFLfE9cD0/oDD20Ejta4AxFpdEICSmXFfOktQHaWJdZ/dcA1rGodPuE9pIQD1D0FKJoBTB/QHIZAGkRIhzyGlFCAuiYD3z9GbYkwESWQMt4GKv7xTpMSBlCvbsBP84C0rtGFP34aGLIcqPTIJiUEoJv6AhvvBXp0tqcZWw4DEz601zdWr7gHtICe6rXJnMk8N8UZSybkbwNyN8fsZqtD3AJKJpAlk4CcUbbkONvpk33A7BKgtsHZuIRy8z27AAXTgRkZzoTcVgnc9hFw4oyzcdF6x50G9e4OrLsbGNXbmZCV9FwjVgJV/zobF6t3XAEaeBHw+QNA3/Nj3Xbz70/Rvae/BRzxyHM1PXvcABpxGfDlg0A3BoJOmtgaiaJ/ltk9BS0uAM3impKPZ4WWmjiT8r51QPFeZ2Oc9G53QG9MAR5nTpXkwI2HBFxCd77QI3ced16sCxPO1Xc591QhQYrKgDnrwWVNalu7aFDaeUDJPcANfdom3DcVwOQiK4tX3XwHlN4T2MC0YXBa20Q78KeVRqiq/4Tfle+ApqYDnzLOkUfMaatmjDP+fWA/IfnVfAOUwRhn2a1W9W80g8A1tD+dHUA6zeWVEz4Ath/xC411HV8A9enBOs6jwKUsWezjotuxhcCYK6wMPdnGwj8xxHcWA5+V+wvHF0BSAaxYwBVazK9CTSBdtwIYSU2S4DCaixc4z3zBtbk7/IejHJCENlVPtl7kKv8LGMDqXxYj6B1cth6pnLH+AEOBte0DRzkgucCm+4Ep/VoXMARp4lVA6WwgJexx++4o7VWB+lgnGn7lNmjk5cC38seGCO0gNWn4u8DNhCTpRsi77almRk84JxvXu7dfUw5IRDuT21I7mopc9rsV20hpdRVnLKpOWu5cxTSOU9TKAV2YClTnxM61dh1jsWs1wTC6liBwK4tf8dCUAhIjLUGh3crgVqYQojmq8ysn4JUCupqrr8uz7RXca1gmnboG+OpXJ7evvq8yQEMvAcS2FLK2PGdo9EdMouRx7wE//KZeYKdXUAJICmBr6ZFKDwK3UysK72CKMYw5FAPE7FJgJ933+Cs5NTMOuJGv/d4Efjnu9Nb96e85oLnXAiunWSmE2JINDPRmMtDLZEC4m4a4LszASIBYH09GJ4y754CkjDGTGjQv81zxfeIqYPMhf35xr6/iOaDQDYoHkwx+CG1RyX7wz1eJ2ZQBSkwcLe9aA4rxS2pAGpC7h11rkNYgrUHuCGgNcsdP2yCtQVqD3BGwoUFSheml9CqJe/LGjQVYoQEnhXVrhcAmAaS3xomsG/kGFpv9UY8yztLbXMfeQTTNRA0rfsOthW+LzFwCWtxBRLcnpokc7mf2ugUoz0zi/mU7ZUMhe6MD32sXapGFPKOh+SZvKcij6E/zcLByJ1Cw6vlYLUUdXiCcUyJZy7Wl1jaBD/M72SKwI20TuJdwCsK3CfwfDc+71wUZ1V4AAAAASUVORK5CYII=' />
        </pattern>
      </defs>
      <rect id='markericon' width='72' height='72' fill='url(#markeron)' />
    </SvgIcon>
  );
}
