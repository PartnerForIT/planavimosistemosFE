import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';

const PlaceIcon = ({ className }) => (
  <SvgIcon viewBox='0 0 24 28' className={className}>   
	<defs>
		<clipPath clipPathUnits="userSpaceOnUse" id="cp1">
			<path d="M-157 -11L1209 -11L1209 1055L-157 1055Z" />
		</clipPath>
	</defs>
	<g id="Settings/General/Company" clip-path="url(#cp1)">
		<g id="Group 2298">
			<g id="Group 1542">
				<path id="Path 12986" fill="#808f94" class="shp0" d="M10.87 17.56L10.87 9.84C8.88 9.33 7.42 7.52 7.42 5.38C7.42 2.86 9.45 0.78 12.01 0.78C14.54 0.78 16.58 2.86 16.58 5.38C16.58 7.53 15.12 9.34 13.13 9.84L13.13 17.56C13.13 21.17 12.49 23.12 12.01 23.12C11.5 23.12 10.87 21.16 10.87 17.56ZM12.26 4.05C12.26 3.21 11.55 2.49 10.69 2.49C9.86 2.49 9.12 3.21 9.12 4.05C9.12 4.91 9.86 5.64 10.69 5.64C11.55 5.64 12.26 4.91 12.26 4.05ZM0.41 22.36C0.41 19.14 5.52 17.18 8.88 17.14L8.88 18.92C6.52 18.96 2.89 20.24 2.89 22.07C2.89 24.2 6.73 25.66 12.01 25.66C17.25 25.66 21.12 24.17 21.12 22.07C21.12 20.24 17.47 18.96 15.12 18.92L15.12 17.14C18.47 17.18 23.59 19.14 23.59 22.36C23.59 25.05 19.37 27.59 12.01 27.59C4.65 27.59 0.41 25.05 0.41 22.36Z" />
			</g>
		</g>
	</g>

  </SvgIcon>
);

export default PlaceIcon;