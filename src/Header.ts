import styled from "@emotion/styled"

import { theme } from "./assets/styles/theme"

export const HeaderStyled = styled.h1<{
	marginTop?: number
	marginBottom?: number
}>(
	({ marginTop, marginBottom }) => `
    margin-inline: 0;
    margin-top: ${marginTop ? marginTop + "px" : "0"};
    margin-bottom: ${marginBottom ? marginBottom + "px" : "2em"};
	text-align: center;
	color: ${theme.color.primary};
    font-size: ${theme.fontSize.xl};
`
)
