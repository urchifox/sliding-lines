import styled from "@emotion/styled"

export const HeaderStyled = styled.h1<{marginTop?: number, marginBottom?: number}>(({marginTop, marginBottom}) =>`
    margin-inline: 0;
    margin-top: ${marginTop ?? 0}px;
    margin-bottom: ${marginBottom ?? 0}px;
	text-align: center;
	color: #68509c;
`)
