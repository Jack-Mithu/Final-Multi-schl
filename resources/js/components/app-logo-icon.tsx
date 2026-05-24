import { GraduationCap, Users, Calendar, BarChart3, Shield, Globe } from 'lucide-react';
import { SVGAttributes } from 'react';

// You need to import SVGAttributes if you want to keep the props type definition.

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    // Instead of rendering the complex path SVG, we use the GraduationCap icon.
    // The 'lucide-react' icons are standard React components that accept SVG props.
    return (
        <GraduationCap {...props} />
    );
}