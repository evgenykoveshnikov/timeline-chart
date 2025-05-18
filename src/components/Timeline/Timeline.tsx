import React, { useState, useRef, useEffect } from 'react';
import styles from '../Timeline/Timeline.module.scss';
import { TimePeriod } from 'data'; // Убедитесь, что этот импорт корректен
import { gsap } from 'gsap';
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'



interface ITimelineProps {
    data: TimePeriod[];
}

export default function Timeline({ data }: ITimelineProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [renderedActive, setRenderedActive] = useState(0)
    const [prevActiveIndex, setPrevActiveIndex] = useState(0);
    const [groupRotation, setGroupRotation] = useState(0);


    const svgRef = useRef<SVGSVGElement>(null);
    const pointElementsRef = useRef<SVGCircleElement[]>([]);
    const groupRef = useRef<SVGGElement>(null);
    const activeTitleRef = useRef<SVGTextElement>(null);
    const numberTextElementsRef = useRef<SVGTextElement[]>([]);
    const startYearRef = useRef<HTMLDivElement>(null);
    const endYearRef = useRef<HTMLDivElement>(null); 
    const swiperPrevButtonRef = useRef<HTMLButtonElement>(null);
    const swiperNextButtonRef = useRef<HTMLButtonElement>(null);
    const swiperContainerRef = useRef<HTMLDivElement>(null);
    const swiperRef = useRef<any>(null)


    
    const radius = 265;
    const center = radius + 30;
    const targetAngle = 360 - 60;
    const angleStepDeg = data.length > 0 ? 360 / data.length : 0;
    
    useEffect(() => {
        if (!groupRef.current || data.length === 0 || !svgRef.current) return;

        const initialRotation = -activeIndex * angleStepDeg + targetAngle;
        groupRef.current.setAttribute(
            'transform',
            `translate(${center}, ${center}) rotate(${initialRotation}) translate(${-center}, ${-center})`
        );
        groupRef.current.setAttribute('data-rotation', initialRotation.toString());

        setGroupRotation(initialRotation);

        pointElementsRef.current.forEach((el, i) => {
            if (el) {
                el.classList.remove(styles.active);
                el.style.removeProperty('fill');
                el.style.removeProperty('r');
         }
     });

        if (pointElementsRef.current[activeIndex]) {
            pointElementsRef.current[activeIndex].classList.add(styles.active);
        }

        const initialActiveTimePeriod = data[activeIndex];
        const titleElement = activeTitleRef.current;

        if(initialActiveTimePeriod && titleElement && pointElementsRef.current[activeIndex] && svgRef.current && groupRef.current) {
            titleElement.textContent = initialActiveTimePeriod.title;

            const activeCircle = pointElementsRef.current[activeIndex];

            const groupCTM_initial = groupRef.current.getCTM();

            if(groupCTM_initial && activeCircle && svgRef.current.createSVGPoint) {
                const circleX_group = parseFloat(activeCircle.getAttribute('cx') || '0');
                const circleY_group = parseFloat(activeCircle.getAttribute('cy') || '0');

                const svgPoint = svgRef.current.createSVGPoint();
                svgPoint.x = circleX_group;
                svgPoint.y = circleY_group;

                const transformedPoint = svgPoint.matrixTransform(groupCTM_initial);

                const offsetX = 42;
                const offsetY = 0;

                titleElement.setAttribute('x', (transformedPoint.x + offsetX).toString());
                titleElement.setAttribute('y', (transformedPoint.y + offsetY).toString());
            }

            gsap.to(titleElement, {
                opacity: 1,
                duration: 0
            })
        }

        const groupCTM_initial = groupRef.current.getCTM();

        if(groupCTM_initial && svgRef.current && svgRef.current.createSVGPoint) {
            pointElementsRef.current.forEach((circleEl, i) => {
                const numberTextEl = numberTextElementsRef.current[i];
                const circleX_group = parseFloat(circleEl.getAttribute('cx') || '0'); 
                const circleY_group = parseFloat(circleEl.getAttribute('cy') || '0'); 

                if (circleEl && numberTextEl && svgRef.current) {
                    const svgPoint = svgRef.current.createSVGPoint();
                    svgPoint.x = circleX_group;
                    svgPoint.y = circleY_group;

                    const transformedPoint = svgPoint?.matrixTransform(groupCTM_initial);

                    numberTextEl.setAttribute('x', transformedPoint?.x.toString())
                    numberTextEl.setAttribute('y', transformedPoint?.y.toString())

                    gsap.to(numberTextEl, {
                        opacity: i === activeIndex ? 1 : 0,
                        duration: 0
                    })

                }
            })
        }

        const currentActivePeriod = data[activeIndex]; 
        const startYearEl = startYearRef.current; 
        const endYearEl = endYearRef.current;
        if (currentActivePeriod && startYearEl && endYearEl) {
            startYearEl.textContent = currentActivePeriod.startYear.toString();
            endYearEl.textContent = currentActivePeriod.endYear.toString();
        }
        setPrevActiveIndex(activeIndex);
    }, [data.length, center, angleStepDeg, targetAngle, svgRef, groupRef, pointElementsRef]);

    useEffect(() => {
        if (!groupRef.current || data.length === 0 || activeIndex === prevActiveIndex) {
            setPrevActiveIndex(activeIndex);
            return;
        }

        numberTextElementsRef.current.forEach(el => {
        if (el) gsap.set(el, { opacity: 0, overwrite: true });
        });

        const startYearEl = startYearRef.current;
        const endYearEl = endYearRef.current;

        const prevTimePeriod = data[prevActiveIndex];
        const newTimePeriod = data[activeIndex];

        if (startYearEl && prevTimePeriod && newTimePeriod) {
            gsap.fromTo(startYearEl, {
                textContent: prevTimePeriod.startYear
            }, {
                textContent: newTimePeriod.startYear,
                duration: 0.8,
                ease: 'power2.out',
                onUpdate: function() {
                    startYearEl.textContent = Math.round(this.targets()[0].textContent).toString();
                }
            })
        }

        if (endYearEl && prevTimePeriod && newTimePeriod) {
            gsap.fromTo(endYearEl, {
                textContent: prevTimePeriod.endYear
            }, {
                textContent: newTimePeriod.endYear,
                duration: 0.8,
                ease: 'power2.out',
                onUpdate: function() {
                    endYearEl.textContent = Math.round(this.targets()[0].textContent).toString();
                }
            })
        }

        const titleElement = activeTitleRef.current;
        const prevNumberTextEl = numberTextElementsRef.current[prevActiveIndex];

        if(titleElement) {
            gsap.to(titleElement, {
                opacity: 0,
                duration: 0,
            })
        }

        if(prevNumberTextEl) {
            gsap.to(prevNumberTextEl, {
                opacity: 0,
                duration: 0.3
            })
        }
        gsap.to(swiperContainerRef.current, {opacity: 0, duration: 0.5})
        rotateGroup();

    
        if (pointElementsRef.current[prevActiveIndex]) {
            pointElementsRef.current[prevActiveIndex].classList.remove(styles.active);
            gsap.to(pointElementsRef.current[prevActiveIndex], {
                fill: '#42567A', 
                r: 3,
                duration: 0.3,
                onComplete: () => {
                    if (pointElementsRef.current[prevActiveIndex]) {
                        pointElementsRef.current[prevActiveIndex].style.removeProperty('fill');
                        pointElementsRef.current[prevActiveIndex].style.removeProperty('r');
                    }
                }
            });
        }
        if (pointElementsRef.current[activeIndex]) {
            pointElementsRef.current[activeIndex].classList.add(styles.active);
            gsap.to(pointElementsRef.current[activeIndex], {
                fill: '#f4f5f9',
                r: 28,
                duration: 0.3,
                onComplete: () => {
                    if (pointElementsRef.current[activeIndex]) {
                        pointElementsRef.current[activeIndex].style.removeProperty('fill');
                        pointElementsRef.current[activeIndex].style.removeProperty('r');
                    }
                }
            });
        }

        const activeTimePEriod = data[activeIndex];
    
        if (activeTimePEriod && titleElement) {
            titleElement.textContent = activeTimePEriod.title;
        }

        const activeNum = numberTextElementsRef.current[activeIndex];
        if (activeNum) {
            gsap.to(activeNum, { opacity: 1, duration: 0.2, overwrite: true });
        }
        setPrevActiveIndex(activeIndex);
    }, [activeIndex, data.length, prevActiveIndex, angleStepDeg, targetAngle, center]);

    useEffect(() => {
        if(swiperRef.current && swiperContainerRef.current) {
            updateSwiperNavButtons(swiperRef.current)
        }
    }, [renderedActive, swiperRef.current, data, swiperContainerRef.current])

    const rotateGroup = () => {
        const targetRotationDeg = -activeIndex * angleStepDeg + targetAngle;
        const currentRotation = groupRef.current?.getAttribute('data-rotation')
        ? parseFloat(groupRef.current.getAttribute('data-rotation') as string)
        : 0;

        gsap.to(
            { rotation: currentRotation }, 
        {
            rotation: targetRotationDeg,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto', 
            onUpdate: function() {
                const currentRot = this.targets()[0].rotation;
                groupRef.current?.setAttribute(
                    'transform',
                    `translate(${center}, ${center}) rotate(${currentRot}) translate(${-center}, ${-center})`
                );
                groupRef.current?.setAttribute('data-rotation', currentRot.toString());
                setGroupRotation(currentRot);

                const groupCTM = groupRef.current?.getCTM(); // Получаем текущую CTM группы
                const svg = svgRef.current;

                if (groupCTM && svg && svg.createSVGPoint) {
                    pointElementsRef.current.forEach((circleEl, i) => {
                        const numberTextEl = numberTextElementsRef.current[i];

                        if (circleEl && numberTextEl) {
                            const circleX_group = parseFloat(circleEl.getAttribute('cx') || '0');
                            const circleY_group = parseFloat(circleEl.getAttribute('cy') || '0');

                            const svgPoint = svg.createSVGPoint();
                            svgPoint.x = circleX_group;
                            svgPoint.y = circleY_group;

                            const transformedPoint = svgPoint.matrixTransform(groupCTM);
                            numberTextEl.setAttribute('x', transformedPoint.x.toString());
                            numberTextEl.setAttribute('y', transformedPoint.y.toString());
                        }
                    })
                }

                const activeCircle = pointElementsRef.current[activeIndex];
                const titleElement = activeTitleRef.current;
                if (activeCircle && titleElement && svgRef.current && groupRef.current) {
                    const groupCTM = groupRef.current.getCTM();
                    
                    if (groupCTM && svgRef.current.createSVGPoint) {
                        const circleX_group = parseFloat(activeCircle.getAttribute('cx') || '0');
                        const circleY_group = parseFloat(activeCircle.getAttribute('cy') || '0');

                        const svgPoint = svgRef.current.createSVGPoint();
                        svgPoint.x = circleX_group;
                        svgPoint.y = circleY_group;
                        const transformedPoint = svgPoint.matrixTransform(groupCTM);

                        const offsetX = 40;
                        const offsetY = 0;

                        titleElement.setAttribute('x', (transformedPoint.x + offsetX).toString());
                        titleElement.setAttribute('y', (transformedPoint.y + offsetY).toString());
                    }
                }
            },
            onComplete: () => {
                const newNumberTextEl = numberTextElementsRef.current[activeIndex];
                    if (newNumberTextEl) { // Проверка на доступность рефа
                        gsap.to(newNumberTextEl, { opacity: 1, duration: 0.3 }); // Настройте длительность появления цифры
                    }
                const titleElement = activeTitleRef.current;
                if(titleElement) {
                    const activeTimePeriod = data[activeIndex];
                    if(activeTimePeriod) {
                        titleElement.textContent = activeTimePeriod.title
                    }
                    gsap.to(titleElement, {
                        opacity: 1,
                        duration: 0.5
                    })
                }

                setRenderedActive(activeIndex)
                const containerElement = swiperContainerRef.current
                if(containerElement) {
                    gsap.to(containerElement, {
                        opacity: 1,
                        duration: 1,
                        ease: 'power2.out'
                    }) 
                }
            }
        }
    );
};

    const handlePointClick = (index: number) => {
        setActiveIndex(index);
    };
    const handlePrevClick = () => {
        if(activeIndex > 0) {
            setActiveIndex(activeIndex - 1)
        }
    }
    const handleNextClick = () => {
        if (activeIndex < data.length - 1) {
            setActiveIndex(activeIndex + 1);
        }
    }
    const handleMouseEnter = (index: number) => {
        if(index !== activeIndex) {
            const numberTextEl = numberTextElementsRef.current[index];
            if (numberTextEl) {
                gsap.to(numberTextEl, {
                    opacity: 1,
                    duration: 0.2
                })
            }
        }
    }
    const handleMouseLeave = (index: number) => {
        if (index !== activeIndex) {
            const numberTextEl = numberTextElementsRef.current[index];
            if(numberTextEl ) {
                gsap.to(numberTextEl, {
                    opacity: 0,
                    duration: 0.2
                })
            }
        }
    }
    const updateSwiperNavButtons = (swiperInstance: any) => {
        const prevButton = swiperPrevButtonRef.current;
        const nextButton = swiperNextButtonRef.current;

        const activePeriod = data[activeIndex];
        const totalSlides = activePeriod.events.length || 0;
        const slidesPerView = 3;
        

        if (totalSlides <= slidesPerView) {
            if (prevButton) {
                gsap.set(prevButton, { opacity: 0, pointerEvents: 'none' });
            }
            if (nextButton) {
                gsap.set(nextButton, { opacity: 0, pointerEvents: 'none' });
            }
            return;
        }

        if (prevButton) {
            const targetPointerEventPrev = swiperInstance.isBeginning ? 'none' : 'all'
            gsap.set(prevButton, {
                pointerEvents: targetPointerEventPrev,
                opacity: swiperInstance.isBeginning ? 0 : 1,
                duration: 0.3
            })
        }

        if (nextButton) {
            const targetPointerEventNext = swiperInstance.isEnd ? 'none' : 'all'
            gsap.set(nextButton, {
                opacity: swiperInstance.isEnd ? 0 : 1,
                pointerEvents: targetPointerEventNext,
                duration: 0.3
            })
        }
    }


    return (
    <div className={styles.timelineContainer}>
        <div className={styles['historical-container']}>
            <div className={styles['historical-gradient']}></div>
            <div className={styles['historical-title']}>
                Исторические <br /> даты
            </div>
        </div>
        <div className={styles.visualWrapper}>
            <div className={styles.yearDisplay}>
                <div className={styles.startYear} ref={startYearRef}>{data[activeIndex].startYear}</div>
                <div className={styles.endYear} ref={endYearRef}>{data[activeIndex].endYear}</div>
            </div>
            <svg
            ref={svgRef}
            className={styles.circle}
            width={center * 2}
            height={center * 2}
            viewBox={`0 0 ${center * 2} ${center * 2}`}>
                <circle
                cx={center}
                cy={center}
                r={radius}
                fill='none'
                stroke='#42567A'
                opacity='0.2'
                strokeWidth='1'>

                </circle>
                <g ref={groupRef}>
                    {data.map((_, i) => {
                        const angleRad = data.length > 0 ? (i / data.length) * 2 *  Math.PI : 0;
                        const x = center + radius * Math.cos(angleRad);
                        const y = center + radius * Math.sin(angleRad);

                        return (
                            <React.Fragment key={`point-${i}`}>
                                <circle
                                ref={(el) => {
                                    if (el) pointElementsRef.current[i] = el;
                                }}
                                cx={x}
                                cy={y}
                                className={styles['point-circle'] + (i === activeIndex ? ' ' + styles.active : '')}
                                onClick={() => handlePointClick(i)}
                                pointerEvents='all'
                                onMouseEnter={() => handleMouseEnter(i)}
                                onMouseLeave={() => handleMouseLeave(i)}>

                                </circle>
                            </React.Fragment>
                        )
                    })}
                </g>
                
                {data.map((_, i) => {
                    return (
                        <text
                        key={`text-${i}`}
                        ref={(el) => {
                            if (el) numberTextElementsRef.current[i] = el;
                        }}
                        className={styles['point-text']}
                        textAnchor='middle'
                        alignmentBaseline='middle'
                        pointerEvents='none'>
                            {i + 1}
                        </text>
                    )
                })}

                <text
                ref={activeTitleRef}
                className={styles['active-title']}
                textAnchor='start'
                alignmentBaseline='middle'
                pointerEvents='none'>

                </text>
            </svg>
        </div>
        <div className={styles.controlSwiper}>
            <div className={styles.controls}>
                
                <div>
                    <div className={styles.indexDisplay}>
                    {`${(activeIndex + 1).toString().padStart(2, '0')}/${data.length.toString().padStart(2, '0')}`}
                </div>
                <div className={styles.navButtons}>
                    <button className={styles.navButton} 
                    onClick={handlePrevClick} 
                    disabled={activeIndex === 0}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <button className={styles.navButton}
                    onClick={handleNextClick}
                    disabled={activeIndex === data.length - 1}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
                </div>
                <div className={styles.periodPagination}>
                    {data.map((_, i) => (
                        <span key={`period-dot-${i}`}
                        className={`${styles.periodDot} ${i === activeIndex ? styles.activePeriod : ''}`}
                        onClick={() => setActiveIndex(i)}>

                        </span>
                    ))}
                </div>
                
            </div>
        <div className={styles.swiperContainer} ref={swiperContainerRef}>
                <div className={styles.mobileTitle}>{data[renderedActive].title}</div>
                <div className={styles.mobileHorizLine}></div>
                <Swiper
                key={renderedActive}
                modules={[Navigation]}
                spaceBetween={25}
                slidesPerView={1.5}
                navigation={false}
                onSlideChange={(swiper) => {
                    updateSwiperNavButtons(swiper)
                }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                breakpoints={{
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 80
                    }
                }}>
                    {data[renderedActive].events.map((el, i) => (
                        <SwiperSlide key={i}>
                            <div className={styles.swiperSlide}>
                                <div className={styles.eventYear}>{el.year}</div>
                                <div className={styles.eventDesc}>{el.description}</div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button
                ref={swiperPrevButtonRef}
                className={`${styles.swiperNavButton} ${styles.swiperNavButtonPrev}`}
                onClick={() => swiperRef.current?.slidePrev()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <button
                ref={swiperNextButtonRef}
                className={`${styles.swiperNavButton} ${styles.swiperNavButtonNext}`}
                onClick={() => swiperRef.current?.slideNext()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
        </div>       
        </div>
        <div className={styles.verticalLineLeft}></div>
        <div className={styles.verticalLineMiddle}></div>
        <div className={styles.verticalLineRight}></div>
        <div className={styles.horizontalLine}></div>
    </div>
)
}