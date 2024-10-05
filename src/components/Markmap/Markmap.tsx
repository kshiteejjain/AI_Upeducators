import { useState, useRef, useEffect } from 'react';
import { Markmap } from 'markmap-view';
import { transformer } from './markmap';
import { Toolbar } from 'markmap-toolbar';
import html2canvas from 'html2canvas';

import 'markmap-toolbar/dist/style.css';

interface MarkmapHooksProps {
    initialValue: string;
}

const MarkmapHooks: React.FC<MarkmapHooksProps> = ({ initialValue }) => {
    const [value] = useState(initialValue);
    const refSvg = useRef<SVGSVGElement>(null);
    const refMm = useRef<Markmap | null>(null);
    const refToolbar = useRef<HTMLDivElement | null>(null);

    function renderToolbar(mm: Markmap, wrapper: HTMLElement) {
        while (wrapper?.firstChild) wrapper.firstChild.remove();
        if (mm && wrapper) {
            const toolbar = new Toolbar();
            toolbar.attach(mm);

            toolbar.register({
                id: 'download',
                title: 'Download PNG Image',
                content: 'Download Image',
                onClick: async () => {
                    const container = document.getElementById('markmap-container');
                    if (container) {
                        const canvas = await html2canvas(container);
                        const link = document.createElement('a');
                        link.href = canvas.toDataURL('image/png');
                        link.download = 'markmap.png';
                        link.click();
                    }
                },
            });

            toolbar.setItems([...Toolbar.defaultItems, 'download']);
            wrapper.append(toolbar.render());
        }
    }

    useEffect(() => {
        if (refMm.current) return;
        if (refSvg.current) {
            const mm = Markmap.create(refSvg.current);
            refMm.current = mm;
            if (refToolbar.current) {
                renderToolbar(refMm.current, refToolbar.current);
            }
        }
    }, [refSvg.current]);

    useEffect(() => {
        const mm = refMm.current;
        if (!mm) return;
        const { root } = transformer.transform(value);
        mm.setData(root);
        mm.fit();
    }, [value]); // Removed refMm.current dependency since it's constant

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <div id="markmap-container" style={{ width: '100%', height: '100%' }}>
                <svg ref={refSvg} style={{ width: '100%', height: '100%' }} />
            </div>
            <div className="absolute bottom-1 right-1" ref={refToolbar}></div>
        </div>
    );
};

export default MarkmapHooks;
