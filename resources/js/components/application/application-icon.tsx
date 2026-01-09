import { JSX, cloneElement } from 'react';
import { BiLogoPhp } from 'react-icons/bi';
import { DiDjango } from 'react-icons/di';
import { FaJava } from 'react-icons/fa';
import { PiFileCSharp } from 'react-icons/pi';
import { SiGo, SiLaravel, SiNodedotjs, SiPython, SiRuby, SiRust } from 'react-icons/si';

const iconMapping: Record<string, JSX.Element> = {
    laravel: <SiLaravel color="#FF2D20" />,
    'node-js': <SiNodedotjs color="#68A063" />,
    nodejs: <SiNodedotjs color="#68A063" />,
    python: <SiPython color="#306998" />,
    ruby: <SiRuby color="#CC342D" />,
    java: <FaJava color="#5382A1" />,
    'c-sharp': <PiFileCSharp color="#68217A" />,
    django: <DiDjango color="#095571" />,
    go: <SiGo color="#00ADD6" />,
    php: <BiLogoPhp color="#777BB1" />,
    rust: <SiRust color="#000000" />,
};

export default function ApplicationIcon({ applicationSlug, size = 32 }: { applicationSlug: string; size?: number }) {
    const iconElement = iconMapping[applicationSlug];

    if (!iconElement) {
        return null;
    }

    return cloneElement(iconElement, { size });
}
