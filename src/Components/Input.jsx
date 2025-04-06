export const Input = ({ name, type, placeholder, value, onChange, className, ref }) => {
    console.log("Input rendered")
    return (
        <input
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={className}
            ref={ref}
        />
    )
}