export const createSelectedColumns = (columns: NDataTableColumns<any>): Array<string> =>
  columns.filter((c: any) => c?.key && c.key !== 'actions').map((c: any) => c.key);

export const createAvailableColumns = (columns: NDataTableColumns<any>): TableColumnSelect[] =>
  columns.reduce((acc: TableColumnSelect[], c: any) => {
    if (c?.key && c?.title && c.key !== 'actions') {
      acc.push({
        value: c.key,
        label: c.title,
      });
    }
    return acc;
  }, []);

export default function useTable(key: string) {
  /** Available columns - show/hide column */
  const selectedColumns = ref<Array<string>>([]);
  const availableColumns = ref<TableColumnSelect[]>([]);

  function initTableColumns(columns: NDataTableColumns<any>) {
    /** Check if selected columns are stored in LS */
    if (localStorage.getItem(key)) {
      selectedColumns.value = JSON.parse(localStorage.getItem(key) || '');
    } else {
      selectedColumns.value = createSelectedColumns(columns.filter(c => c?.show !== false));
    }
    availableColumns.value = createAvailableColumns(columns);
  }

  function handleColumnChange(selectedValues: Array<string>) {
    selectedColumns.value = selectedValues;
    localStorage.setItem(key, JSON.stringify(selectedColumns.value));
  }

  return {
    availableColumns,
    selectedColumns,
    handleColumnChange,
    initTableColumns,
  };
}
