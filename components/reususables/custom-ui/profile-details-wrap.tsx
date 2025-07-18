export const ProfileDetailsWrap = ({label, value}: {label: string, value: string}) => {
    return (
        <div>
            <label className="text-sm text-lightBrown/50 font-medium  mb-1 block">{label}</label>
            <p className="font-semibold text-sm text-lightBrown">{value}</p>
        </div>
    )
}
