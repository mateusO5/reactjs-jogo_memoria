import { ReactEventHandler } from 'react';
import * as C from './styles';

type Props = {
    label: string;
    icon: any;
    onClick: ReactEventHandler<HTMLDivElement>;
}

export const Button = ({ label, icon, onClick}: Props) => {
    return(
        <C.Container onClick={onClick}>
            <C.IconArea>
                <C.Icon src={icon}/>
            </C.IconArea>
            <C.label>{label}</C.label>
            
        </C.Container>

    )
}