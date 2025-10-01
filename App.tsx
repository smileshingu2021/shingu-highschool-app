import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { School, SortType, ActiveFilters, SchoolType, SchoolCategory, SchoolSystem } from './types';
import { schoolData } from './data/schools';
import { getSchoolAdvice } from './services/geminiService';
import Header from './components/Header';
import Introduction from './components/Introduction';
import FilterControls from './components/FilterControls';
import SchoolList from './components/SchoolList';
import GeminiAdvisor from './components/GeminiAdvisor';
import Footer from './components/Footer';

const App: React.FC = () => {
    const [schools, setSchools] = useState<School[]>([]);
    const [sort, setSort] = useState<SortType>(SortType.DeviationDesc);
    const [filters, setFilters] = useState<ActiveFilters>({
        public: true,
        private: true,
        fullTime: true,
        partTime: true,
        correspondence: true,
        gradeSystem: true,
        creditSystem: true,
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
    const [aiAdvice, setAiAdvice] = useState<string>('');
    const [aiError, setAiError] = useState<string>('');
    const [recommendedSchoolIds, setRecommendedSchoolIds] = useState<number[]>([]);


    useEffect(() => {
        // Simulate data fetching
        setTimeout(() => {
            setSchools(schoolData);
            setIsLoading(false);
        }, 500);
    }, []);

    const handleFilterChange = useCallback((newFilters: ActiveFilters) => {
        setFilters(newFilters);
        setAiAdvice('');
        setRecommendedSchoolIds([]);
        setAiError('');
    }, []);

    const handleSortChange = useCallback((newSort: SortType) => {
        setSort(newSort);
        setAiAdvice('');
        setRecommendedSchoolIds([]);
        setAiError('');
    }, []);


    const filteredAndSortedSchools = useMemo(() => {
        let filteredSchools = schools.filter(school => {
            const typeFilters = [
                { active: filters.public, value: SchoolType.Public },
                { active: filters.private, value: SchoolType.Private }
            ];
            const activeTypeFilters = typeFilters.filter(f => f.active);
            if (activeTypeFilters.length > 0 && !activeTypeFilters.some(f => school.type === f.value)) {
                return false;
            }

            const categoryFilters = [
                { active: filters.fullTime, value: SchoolCategory.FullTime },
                { active: filters.partTime, value: SchoolCategory.PartTime },
                { active: filters.correspondence, value: SchoolCategory.Correspondence }
            ];
            const activeCategoryFilters = categoryFilters.filter(f => f.active);
            if (activeCategoryFilters.length > 0 && !activeCategoryFilters.some(f => school.category.includes(f.value))) {
                return false;
            }

            const systemFilters = [
                { active: filters.gradeSystem, value: SchoolSystem.Grade },
                { active: filters.creditSystem, value: SchoolSystem.Credit }
            ];
            const activeSystemFilters = systemFilters.filter(f => f.active);
            if (activeSystemFilters.length > 0 && !activeSystemFilters.some(f => school.system === f.value)) {
                return false;
            }

            return true;
        });

        switch (sort) {
            case SortType.DeviationDesc:
                return filteredSchools.sort((a, b) => b.deviation - a.deviation);
            case SortType.DeviationAsc:
                 return filteredSchools.sort((a, b) => a.deviation - b.deviation);
            case SortType.CommuteTimeAsc:
                return filteredSchools.sort((a, b) => a.commuteTime - b.commuteTime);
            default:
                return filteredSchools;
        }
    }, [schools, sort, filters]);

    const handleGetAdvice = useCallback(async (prompt: string) => {
        setIsAiLoading(true);
        setAiAdvice('');
        setAiError('');
        setRecommendedSchoolIds([]);
        try {
            const result = await getSchoolAdvice(filteredAndSortedSchools, prompt);
            setAiAdvice(result.advice);
            setRecommendedSchoolIds(result.recommended_school_ids);
        } catch (error) {
            console.error(error);
            setAiError('AIからのアドバイス取得中にエラーが発生しました。しばらくしてから再度お試しください。');
        } finally {
            setIsAiLoading(false);
        }
    }, [filteredAndSortedSchools]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Introduction />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-8">
                    <div className="lg:col-span-1 lg:sticky lg:top-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">学校を探す</h2>
                        <FilterControls 
                            currentSort={sort} 
                            onSortChange={handleSortChange}
                            activeFilters={filters}
                            onFilterChange={handleFilterChange}
                        />
                        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                            <GeminiAdvisor onGetAdvice={handleGetAdvice} isLoading={isAiLoading} advice={aiAdvice} error={aiError} />
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                         {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : (
                            <SchoolList schools={filteredAndSortedSchools} recommendedSchoolIds={recommendedSchoolIds} />
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;