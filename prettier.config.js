/** @type {import("prettier").Config} */
export default {
	trailingComma: "es5",
	useTabs: true,
	arrowParens: "always",
	semi: false,
	singleQuote: false,
	importOrder: [
		"^.+\\.css$",
		"^.+\\.(svg|png|jpg)$",
		"^[^./]", // Сторонние библиотеки (не начинаются с . или /)
		"^\\.", // Локальные импорты (./ и ../)
	],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	importOrderGroupNamespaceSpecifiers: true,
	plugins: ["@trivago/prettier-plugin-sort-imports"],
}
