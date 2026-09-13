import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "./input-group";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	placeholder: string;
}

const PasswordInput = ({ placeholder, ...props }: PasswordInputProps) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<InputGroup>
			<InputGroupInput
				{...props}
				placeholder={placeholder}
				type={showPassword ? "text" : "password"}
			/>

			<InputGroupAddon align="inline-end">
				<InputGroupButton
					aria-label={showPassword ? "Hide password" : "Show password"}
					aria-pressed={showPassword}
					onClick={() => setShowPassword((prev) => !prev)}
					size="icon-sm"
					type="button"
				>
					{showPassword ? <IconEyeOff /> : <IconEye />}
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	);
};

export default PasswordInput;
