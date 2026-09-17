import { Lightbulb, Bug, GitPullRequest, Mail, ArrowUpRight, Github, ShieldCheck, type LucideIcon } from 'lucide-react';
import { GITHUB_REPO_URL, GITHUB_FEATURE_REQUEST_URL, GITHUB_BUG_REPORT_URL, CONTACT_EMAIL, CONTACT_MAILTO_URL } from '../../../constants/site';
import { useI18n } from '../../../i18n/context';

/** 社区共建入口的结构定义 */
interface CommunityEntry {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  href: string;
  /** 在 1 列堆叠 / sm 2×2 / lg 4 列三种网格形态下精确拼合分割线（替代 divide 以避免换行错位） */
  borderClass: string;
  /** 描述文本中需要高亮渲染的片段（如联系邮箱）；省略或翻译中未包含该片段时整段普通渲染 */
  highlight?: string;
}

/**
 * 社区共建入口配置
 * 受「零追踪、无服务端」原则约束，反馈渠道以外链直达 GitHub Issues（预置标签）为主，
 * 并为不使用 GitHub 的用户提供邮件兜底渠道
 */
const COMMUNITY_ENTRIES: readonly CommunityEntry[] = [
  { icon: Lightbulb, titleKey: 'community.featureTitle', descKey: 'community.featureDesc', href: GITHUB_FEATURE_REQUEST_URL, borderClass: '' },
  { icon: Bug, titleKey: 'community.bugTitle', descKey: 'community.bugDesc', href: GITHUB_BUG_REPORT_URL, borderClass: 'border-t sm:border-t-0 sm:border-l' },
  { icon: GitPullRequest, titleKey: 'community.contributeTitle', descKey: 'community.contributeDesc', href: GITHUB_REPO_URL, borderClass: 'border-t sm:border-l-0 lg:border-l lg:border-t-0' },
  { icon: Mail, titleKey: 'community.emailTitle', descKey: 'community.emailDesc', href: CONTACT_MAILTO_URL, borderClass: 'border-t sm:border-l lg:border-t-0', highlight: CONTACT_EMAIL },
];

/**
 * 首页社区共建区块
 *
 * @description 提供功能建议、问题反馈与代码共建三个 GitHub 直达入口；单卡片内三列分割布局，
 * 视觉语言与 ToolsGrid 卡片体系保持一致；底部提示行说明不设站内反馈表单的隐私原则；全部文案走 i18n
 * @returns 社区共建区块组件
 */
function Community() {
  const { t } = useI18n();

  return (
    <section className="pb-12 md:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="pb-8 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-2xl">
              {t('community.title')}
            </h2>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-3 py-1 text-[11px] font-medium text-stone-600 dark:text-stone-300">
              <Github className="h-3 w-3" />
              {t('community.badge')}
            </div>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            {t('community.subtitle')}
          </p>
        </div>

        {/* Unified Entries Card */}
        <div className="mt-8 overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {COMMUNITY_ENTRIES.map((entry) => (
              <a
                key={entry.titleKey}
                href={entry.href}
                {...(entry.href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                className={`group border-stone-200 p-6 transition-colors hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/50 ${entry.borderClass}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-900 dark:bg-stone-800 text-emerald-400 transition-transform group-hover:scale-105">
                  <entry.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {t(entry.titleKey)}
                  </h3>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-stone-300 dark:text-stone-600 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-stone-900 dark:group-hover:text-stone-100" />
                </div>
                <p className="mt-1.5 text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                  {entry.highlight
                    ? t(entry.descKey).split(entry.highlight).map((part, index, parts) => (
                        <span key={index}>
                          {part}
                          {index < parts.length - 1 && (
                            <span className="font-mono text-[13px] font-medium text-emerald-600 dark:text-emerald-400">
                              {entry.highlight}
                            </span>
                          )}
                        </span>
                      ))
                    : t(entry.descKey)}
                </p>
              </a>
            ))}
          </div>

          {/* Privacy Principle Footnote */}
          <div className="flex items-start gap-2 border-t border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 px-6 py-3.5 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{t('community.note')}</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Community;
