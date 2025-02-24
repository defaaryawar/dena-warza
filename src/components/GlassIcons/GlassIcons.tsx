// Update GlassIconsProps interface to accept onClick if needed
interface GlassIconsProps {
    items: IconItem[];
    className?: string;
    onClick?: (name: string) => void;
    isModalOpen: boolean;
    name: string;
}

interface IconItem {
    // label: string;
    color: keyof typeof gradientMapping | string;
    icon: React.ReactNode;
    customClass?: string;
    onClick?: () => void; 
}



const gradientMapping: Record<string, string> = {
    blue: "linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))",
    purple: "linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))",
    red: "linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))",
    indigo: "linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))",
    orange: "linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))",
    green: "linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))",
};

const GlassIcons: React.FC<GlassIconsProps> = ({ items, className, onClick, isModalOpen, name }) => {
    const handleClick = () => {
        if (onClick) onClick(name); // Kirim name ke parent component
    };

    const getBackgroundStyle = (color: keyof typeof gradientMapping | string) => {
        if (gradientMapping[color]) {
            return { background: gradientMapping[color] };
        }
        return { background: color };
    };

    return (
        <div
            className={`grid gap-[5em] grid-cols-2 md:grid-cols-3 mx-auto py-[3em] overflow-visible ${className || ""}`}
            onClick={handleClick}
        >
            {items.map((item, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={item.onClick}
                    className={`relative bg-transparent outline-none md:w-[4.5em] md:h-[4.5em] cursor-pointer h-[4em] w-[4em] [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] ${isModalOpen ? 'hover' : 'group'} ${item.customClass || ""}`}
                >
                    {/* Back layer */}
                    <span
                        className={`absolute top-0 left-0 w-full h-full rounded-[1.25em] block transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[100%_100%] rotate-[15deg] ${isModalOpen ? 'group-hover:[transform:rotate(25deg)_translate3d(-0.5em,-0.5em,0.5em)]' : 'group-hover:[transform:rotate(25deg)_translate3d(-0.5em,-0.5em,0.5em)]'}`}
                        style={{
                            ...getBackgroundStyle(item.color),
                            boxShadow: "0.5em -0.5em 0.75em hsla(223, 10%, 10%, 0.15)",
                            transform: isModalOpen ? 'rotate(25deg) translate3d(-0.5em, -0.5em, 0.5em)' : undefined
                        }}
                    ></span>

                    {/* Front layer */}
                    <span
                        className="absolute top-0 left-0 w-full h-full rounded-[1.25em] bg-[hsla(0,0%,100%,0.15)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[80%_50%] flex backdrop-blur-[0.75em] [-webkit-backdrop-filter:blur(0.75em)] transform group-hover:[transform:translateZ(2em)]"
                        style={{
                            boxShadow: "0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset",
                            transform: isModalOpen ? 'translateZ(2em)' : undefined
                        }}
                    >
                        <span className="m-auto w-[1.5em] h-[1.5em] flex items-center justify-center" aria-hidden="true">
                            {item.icon}
                        </span>
                    </span>
                </button>
            ))}
        </div>
    );
};

export default GlassIcons;