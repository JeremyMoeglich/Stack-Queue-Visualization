const code_text = '([a-zA-Z][a-zA-Z0-9_\\-]*)';
const white_space = '([ \\n\\t]*)';
const number = `([0-9][0-9]*)`;
const string = `['"].*?['"]`;
const ordering = '(\\(.*\\))';
const l_operator = `[\\+-]`;
const p_operator = `[\\*/]`;
const l_opperation = `.*?${l_operator}.*`;
const p_opperation = `.*?${p_operator}.*`;
const value = `(${number}|${string})`;
const func = `(${code_text}${ordering})`;
const expression = `(${func}|${value}|${code_text})|${white_space}|${p_opperation}|${l_opperation}|${ordering}`;
const assignment = `(${code_text}${white_space}=${white_space}${expression})`;
const code_line = `(${assignment}|${expression})`;
export let variables: { [key: string]: number | string | undefined | boolean } = {
	True: true,
	true: true,
	False: false,
	false: false
};

function parse_string(v: string): string | Error {
	v = v.trim();
	const v_index_first = v.at(0);
	const v_index_last = v.at(-1);
	if (v_index_first === undefined || v_index_last === undefined) {
		return Error('string too short');
	}
	if (!(`'"`.includes(v_index_first) && `'"`.includes(v_index_last))) {
		return Error(`String doesn't start/end in " or '`);
	}
	return v.slice(1, -1);
}

function execute_assignment(v: string, commands: { [key: string]: Function }) {
	v = v.trim();
	const equal_index = v.indexOf('=');
	const var_name = v.slice(0, equal_index).trim();
	const value = v.slice(equal_index + 1).trim();
	const parsed_value = parse_expression(value, commands);
	if (parsed_value instanceof Error) {
		return parsed_value;
	}
	variables[var_name] = parsed_value;
	return `Defined ${var_name} as ${parsed_value}`;
}

function parse_number(v: string) {
	if (!new RegExp(`^(${number})$`).test(v)) {
		return Error('Number Syntax Error');
	}
	return parseInt(v);
}

function parse_value(v: string) {
	if (new RegExp(`^(${number})$`).test(v)) {
		return parse_number(v);
	} else if (new RegExp(`^${string}$`).test(v)) {
		return parse_string(v);
	} else {
		return Error('Value Syntax Error');
	}
}

function parse_func(
	v: string,
	commands: { [key: string]: Function }
): string | number | Error | boolean | undefined {
	let layer = 0;
	let index: number | undefined = undefined;
	for (const [current_index, char] of v.split('').reverse().entries()) {
		if (char === '(') {
			layer--;
		} else if (char === ')') {
			layer++;
		}
		if (layer === 0) {
			index = v.length - current_index;
			break;
		}
	}
	if (index === undefined) {
		return Error('Invalid Brackets');
	}
	const command = v.slice(0, index - 1);
	const value = v.slice(index, -1);
	if (!(command in commands)) {
		return Error('Unknown Command');
	}

	if (value) {
		const parsed_value = parse_expression(value, commands);
		if (parsed_value instanceof Error) {
			return parsed_value;
		}
		return commands[command](parsed_value);
	} else {
		return commands[command]();
	}
}

function parse_variable(
	v: string,
	commands: { [key: string]: Function }
): string | number | Error | undefined | boolean {
	if (v in variables) {
		return variables[v];
	} else if (v in commands) {
		return Error(`${v} is a function`);
	} else {
		return Error(`${v} is not defined`);
	}
}

function stringify(v: any): any {
	if (typeof v === 'string') {
		return `"${v}"`;
	}
	return v;
}

function is_ordering(v: string): boolean {
    v = v.trim()
    if (v[0] !== '(') {
        return false
    }
    else if (v.at(-1) !== ')') {
        return false
    }
    else if (v.split(')').length > 2) {
        return false
    }
    else {
        return true
    }
}

function is_operation(v: string, operator_reg_string: string): boolean {
	let layer = 0;
	let index = undefined;
	const operator_regex = new RegExp(`^(${operator_reg_string})$`);
	for (const [current_index, char] of v.split('').entries()) {
		if (char === '(') {
			layer--;
		} else if (char === ')') {
			layer++;
		}
		if (layer === 0 && operator_regex.test(char)) {
			index = current_index;
			break;
		}
	}
	if (index === undefined) {
		return false;
	} else {
		return true;
	}
}

function parse_opperation(
	v: string,
	commands: { [key: string]: Function },
	operator_reg_string: string
): string | number | Error | undefined | boolean {
	let layer = 0;
	let index: number | undefined = undefined;
	const operator_regex = new RegExp(`^(${operator_reg_string})$`);
	for (const [current_index, char] of v.split('').entries()) {
		if (char === '(') {
			layer--;
		} else if (char === ')') {
			layer++;
		}
		if (layer === 0 && operator_regex.test(char)) {
			index = current_index;
			break;
		}
	}
	if (index === undefined) {
		return Error('Invalid Brackets');
	}
	const expr1 = parse_expression(v.slice(0, index), commands);
	if (expr1 instanceof Error) {
		return expr1;
	}
	const expr2 = parse_expression(v.slice(index + 1), commands);
	if (expr2 instanceof Error) {
		return expr2;
	}
	const chosen_operator = v.at(index);
	return eval(`${stringify(expr1)}${chosen_operator}${stringify(expr2)}`);
}

function parse_ordering(
	v: string,
	commands: { [key: string]: Function }
): string | number | Error | undefined | boolean {
	return parse_expression(v.slice(1, v.length - 1), commands);
}

function parse_expression(
	v: string,
	commands: { [key: string]: Function }
): string | number | Error | undefined | boolean {
	v = v.trim();
	if (new RegExp(`^(${ordering})$`).test(v) && is_ordering(v)) {
		return parse_ordering(v, commands);
	} else if (new RegExp(`^(${l_opperation})$`).test(v) && is_operation(v, l_operator)) {
		return parse_opperation(v, commands, l_operator);
	} else if (new RegExp(`^(${p_opperation})$`).test(v) && is_operation(v, p_operator)) {
		return parse_opperation(v, commands, p_operator);
	} else if (new RegExp(`^(${func})$`).test(v)) {
		return parse_func(v, commands);
	} else if (new RegExp(`^(${value})$`).test(v)) {
		return parse_value(v);
	} else if (new RegExp(`^(${code_text})$`).test(v)) {
		return parse_variable(v, commands);
	} else if (new RegExp(`^(${white_space})$`).test(v)) {
		return undefined;
	} else {
		return Error('Expression Syntax Error');
	}
}

export function parse_code_line(
	v: string,
	commands: { [key: string]: Function }
): Error | string | number | boolean | undefined {
    v = v.trim()
	if (!new RegExp(`^(${code_line})$`).test(v)) {
		return Error('Syntax Error');
	} else if (new RegExp(`^(${expression})$`).test(v)) {
		return parse_expression(v, commands);
	} else if (new RegExp(`^(${assignment})$`).test(v)) {
		return execute_assignment(v, commands);
	} else {
		return Error('Code_Line Regex Error');
	}
}
const cmds = {
	push: (v: any) => {
		return v;
	},
	pop: () => {
		return 'some value';
	}
};

