import {Circle, Rect, RectProps, Txt} from '@motion-canvas/2d';
import {createRef, createSignal, SignalValue} from '@motion-canvas/core';
import {all} from '@motion-canvas/core/lib/flow';

/**
 * 可复用的服务器节点：圆角矩形 + 标题 + 数据值 + 状态灯/状态文字。
 * 全书共用：主库、从库、客户端、分区节点都用它，只换配色与文案。
 */
export interface ServerNodeProps extends RectProps {
  /** 大标题，如 “主库” / “从库 A” */
  title: SignalValue<string>;
  /** 小字角色，如 “Leader · 写” / “Follower · 读” */
  role: SignalValue<string>;
  /** 初始数据值，如 “x = 41” */
  initialValue: SignalValue<string>;
  /** 边框强调色 */
  accent: SignalValue<string>;
  /** 初始值颜色 */
  valueColor?: SignalValue<string>;
  /** 初始状态文字 */
  initialStatus?: SignalValue<string>;
  /** 初始状态文字颜色 */
  statusColor?: SignalValue<string>;
}

export class ServerNode extends Rect {
  public readonly valueText = createRef<Txt>();
  public readonly statusText = createRef<Txt>();
  public readonly light = createRef<Circle>();

  private readonly valueSignal = createSignal('x = 41');
  private readonly statusSignal = createSignal('');
  private readonly lightSignal = createSignal('#64748B');

  public constructor(props: ServerNodeProps) {
    const {
      title,
      role,
      initialValue,
      accent,
      valueColor,
      initialStatus,
      statusColor,
      ...rest
    } = props;
    super({
      ...rest,
      width: 300,
      height: 170,
      radius: 18,
      fill: '#1E293B',
      stroke: accent,
      lineWidth: 3,
    });

    this.valueSignal(initialValue as string);
    if (initialStatus) this.statusSignal(initialStatus as string);
    this.lightSignal(accent as string);

    this.add(
      <>
        {/* 状态灯：右上角 */}
        <Circle
          ref={this.light}
          position={[122, -62]}
          size={20}
          fill={() => this.lightSignal()}
          stroke={'#0F172A'}
          lineWidth={2}
        />
        {/* 角色小字 */}
        <Txt
          position={[0, -52]}
          fontSize={20}
          fill={'#94A3B8'}
          fontFamily={'"Noto Sans CJK SC", sans-serif'}
          text={role}
        />
        {/* 标题 */}
        <Txt
          position={[0, -16]}
          fontSize={32}
          fontWeight={700}
          fill={'#FFFFFF'}
          fontFamily={'"Noto Sans CJK SC", sans-serif'}
          text={title}
        />
        {/* 数据值（信号驱动，改值即改文案） */}
        <Txt
          ref={this.valueText}
          position={[0, 30]}
          fontSize={46}
          fontWeight={700}
          fill={valueColor ?? '#FFFFFF'}
          fontFamily={'"Noto Sans CJK SC", sans-serif'}
          text={() => this.valueSignal()}
        />
        {/* 状态文字 */}
        <Txt
          ref={this.statusText}
          position={[0, 66]}
          fontSize={20}
          fill={statusColor ?? '#94A3B8'}
          fontFamily={'"Noto Sans CJK SC", sans-serif'}
          text={() => this.statusSignal()}
        />
      </>,
    );
  }

  /** 改数据值：换文案 + 变色 + 轻微放大回弹 */
  public *setValue(text: string, color: string, duration = 0.5) {
    this.valueSignal(text);
    yield* all(
      this.valueText().scale(1.3, 0.15).to(1, 0.3),
      this.valueText().fill(color, duration),
    );
  }

  /** 改状态文字与状态灯颜色 */
  public *setStatus(text: string, color: string, duration = 0.4) {
    this.statusSignal(text);
    this.lightSignal(color);
    yield* this.statusText().fill(color, duration);
  }

  /** 边框闪一下：先变色再恢复 */
  public *flash(color: string) {
    const accent = this.stroke();
    yield* this.stroke(color, 0.25).to(accent, 0.45);
  }
}
