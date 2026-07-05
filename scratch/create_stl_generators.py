import os
import json

target_dir = "/home/osk/Documents/PROJECT/CP-vault/src/data/generators/4_algorithms/"
os.makedirs(target_dir, exist_ok=True)

# Clean existing JSON files in target_dir to avoid duplicates
for f in os.listdir(target_dir):
    if f.endswith(".json"):
        os.remove(os.path.join(target_dir, f))

algorithms = []

# Helper to validate C++ identifier
cpp_var_validation = {
    "pattern": "^[a-zA-Z_][a-zA-Z0-9_]*$",
    "message": "Must be a valid C++ identifier"
}

# 1. SORTING
# sort (Special layout, copy the existing format but scaled fonts)
algorithms.append({
    "id": "algorithm-sort",
    "title": "sort",
    "category": "STL Algorithms (Sorting)",
    "aliases": ["sort", "sorting", "ascending", "descending", "order"],
    "inputs": [
        {
            "id": "containerName",
            "label": "Container Variable",
            "type": "string",
            "default": "v",
            "validation": cpp_var_validation
        },
        {
            "id": "sortOrder",
            "label": "Order",
            "type": "select",
            "options": ["Ascending", "Descending (rbegin/rend)", "Descending (greater<T>)", "Custom Comparator"],
            "default": "Ascending"
        },
        {
            "id": "dataType",
            "label": "Element Type (T)",
            "type": "nested_type",
            "default": "int",
            "condition": "sortOrder === 'Descending (greater<T>)'"
        },
        {
            "id": "comparator",
            "label": "Comparator Function Name",
            "type": "string",
            "default": "cmp",
            "condition": "sortOrder === 'Custom Comparator'"
        }
    ],
    "templates": [
        {"condition": "sortOrder === 'Ascending'", "value": "sort({{containerName}}.begin(), {{containerName}}.end());"},
        {"condition": "sortOrder === 'Descending (rbegin/rend)'", "value": "sort({{containerName}}.rbegin(), {{containerName}}.rend());"},
        {"condition": "sortOrder === 'Descending (greater<T>)'", "value": "sort({{containerName}}.begin(), {{containerName}}.end(), greater<{{dataType}}>());"},
        {"condition": "sortOrder === 'Custom Comparator'", "value": "sort({{containerName}}.begin(), {{containerName}}.end(), {{comparator}});"}
    ]
})

# stable_sort
algorithms.append({
    "id": "algorithm-stable-sort",
    "title": "stable_sort",
    "category": "STL Algorithms (Sorting)",
    "aliases": ["stable sort", "stable_sort", "sorting"],
    "inputs": [
        {"id": "containerName", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "sortOrder", "label": "Order", "type": "select", "options": ["Ascending", "Custom Comparator"], "default": "Ascending"},
        {"id": "comparator", "label": "Comparator Function Name", "type": "string", "default": "cmp", "condition": "sortOrder === 'Custom Comparator'"}
    ],
    "templates": [
        {"condition": "sortOrder === 'Ascending'", "value": "stable_sort({{containerName}}.begin(), {{containerName}}.end());"},
        {"condition": "sortOrder === 'Custom Comparator'", "value": "stable_sort({{containerName}}.begin(), {{containerName}}.end(), {{comparator}});"}
    ]
})

# partial_sort
algorithms.append({
    "id": "algorithm-partial-sort",
    "title": "partial_sort",
    "category": "STL Algorithms (Sorting)",
    "aliases": ["partial sort", "k smallest"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "limit", "label": "Sort Limit (Index/Count)", "type": "string", "default": "k"}
    ],
    "template": "partial_sort({{container}}.begin(), {{container}}.begin() + {{limit}}, {{container}}.end());"
})

# nth_element
algorithms.append({
    "id": "algorithm-nth-element",
    "title": "nth_element",
    "category": "STL Algorithms (Sorting)",
    "aliases": ["nth_element", "median", "kth smallest", "quickselect", "perm"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "nth", "label": "K-th Element Index", "type": "string", "default": "k"}
    ],
    "template": "nth_element({{container}}.begin(), {{container}}.begin() + {{nth}}, {{container}}.end());"
})

# is_sorted
algorithms.append({
    "id": "algorithm-is-sorted",
    "title": "is_sorted",
    "category": "STL Algorithms (Sorting)",
    "aliases": ["is_sorted", "check sort"],
    "inputs": [{"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation}],
    "template": "bool sorted = is_sorted({{container}}.begin(), {{container}}.end());"
})

# is_sorted_until
algorithms.append({
    "id": "algorithm-is-sorted-until",
    "title": "is_sorted_until",
    "category": "STL Algorithms (Sorting)",
    "aliases": ["is_sorted_until", "unsorted point"],
    "inputs": [{"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation}],
    "template": "auto first_unsorted = is_sorted_until({{container}}.begin(), {{container}}.end());"
})

# partition
algorithms.append({
    "id": "algorithm-partition",
    "title": "partition",
    "category": "STL Algorithms (Sorting)",
    "aliases": ["partition", "divide", "split"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "predicate", "label": "Predicate Function / Lambda", "type": "string", "default": "[](int x) { return x % 2 == 0; }"}
    ],
    "template": "auto boundary = partition({{container}}.begin(), {{container}}.end(), {{predicate}});"
})

# stable_partition
algorithms.append({
    "id": "algorithm-stable-partition",
    "title": "stable_partition",
    "category": "STL Algorithms (Sorting)",
    "aliases": ["stable_partition", "partition preserving order"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "predicate", "label": "Predicate Function / Lambda", "type": "string", "default": "[](int x) { return x % 2 == 0; }"}
    ],
    "template": "auto boundary = stable_partition({{container}}.begin(), {{container}}.end(), {{predicate}});"
})


# 2. BINARY SEARCH
# lower_bound
algorithms.append({
    "id": "algorithm-lower-bound",
    "title": "lower_bound",
    "category": "STL Algorithms (Binary Search)",
    "aliases": ["lb", "lower bound", "binary search", "first greater or equal", "search"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "value", "label": "Target Value", "type": "string", "default": "x"}
    ],
    "template": "auto it = lower_bound({{container}}.begin(), {{container}}.end(), {{value}});"
})

# upper_bound
algorithms.append({
    "id": "algorithm-upper-bound",
    "title": "upper_bound",
    "category": "STL Algorithms (Binary Search)",
    "aliases": ["ub", "upper bound", "first strictly greater", "search"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "value", "label": "Target Value", "type": "string", "default": "x"}
    ],
    "template": "auto it = upper_bound({{container}}.begin(), {{container}}.end(), {{value}});"
})

# equal_range
algorithms.append({
    "id": "algorithm-equal-range",
    "title": "equal_range",
    "category": "STL Algorithms (Binary Search)",
    "aliases": ["equal range", "range match", "binary search", "search"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "value", "label": "Target Value", "type": "string", "default": "x"}
    ],
    "template": "auto [low, high] = equal_range({{container}}.begin(), {{container}}.end(), {{value}});"
})

# binary_search
algorithms.append({
    "id": "algorithm-binary-search",
    "title": "binary_search",
    "category": "STL Algorithms (Binary Search)",
    "aliases": ["binary search", "bs", "exists", "search"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "value", "label": "Target Value", "type": "string", "default": "x"}
    ],
    "template": "bool found = binary_search({{container}}.begin(), {{container}}.end(), {{value}});"
})


# 3. NUMERIC
# accumulate
algorithms.append({
    "id": "algorithm-accumulate",
    "title": "accumulate",
    "category": "STL Algorithms (Numeric)",
    "aliases": ["sum", "total", "accumulate", "numeric", "sum value"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "init", "label": "Initial Value (and type)", "type": "string", "default": "0LL"}
    ],
    "template": "auto sum = accumulate({{container}}.begin(), {{container}}.end(), {{init}});"
})

# reduce
algorithms.append({
    "id": "algorithm-reduce",
    "title": "reduce",
    "category": "STL Algorithms (Numeric)",
    "aliases": ["reduce", "sum parallel", "sum"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "init", "label": "Initial Value", "type": "string", "default": "0"}
    ],
    "template": "auto sum = reduce({{container}}.begin(), {{container}}.end(), {{init}});"
})

# partial_sum
algorithms.append({
    "id": "algorithm-partial-sum",
    "title": "partial_sum",
    "category": "STL Algorithms (Numeric)",
    "aliases": ["partial sum", "prefix sums", "sum"],
    "inputs": [
        {"id": "container", "label": "Source Container", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "result", "label": "Destination Container", "type": "string", "default": "pref", "validation": cpp_var_validation}
    ],
    "template": "partial_sum({{container}}.begin(), {{container}}.end(), {{result}}.begin());"
})

# adjacent_difference
algorithms.append({
    "id": "algorithm-adjacent-difference",
    "title": "adjacent_difference",
    "category": "STL Algorithms (Numeric)",
    "aliases": ["adjacent difference", "difference differences"],
    "inputs": [
        {"id": "container", "label": "Source Container", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "result", "label": "Destination Container", "type": "string", "default": "diff", "validation": cpp_var_validation}
    ],
    "template": "adjacent_difference({{container}}.begin(), {{container}}.end(), {{result}}.begin());"
})

# inclusive_scan
algorithms.append({
    "id": "algorithm-inclusive-scan",
    "title": "inclusive_scan",
    "category": "STL Algorithms (Numeric)",
    "aliases": ["inclusive scan", "prefix scan"],
    "inputs": [
        {"id": "container", "label": "Source Container", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "result", "label": "Destination Container", "type": "string", "default": "pref", "validation": cpp_var_validation}
    ],
    "template": "inclusive_scan({{container}}.begin(), {{container}}.end(), {{result}}.begin());"
})

# exclusive_scan
algorithms.append({
    "id": "algorithm-exclusive-scan",
    "title": "exclusive_scan",
    "category": "STL Algorithms (Numeric)",
    "aliases": ["exclusive scan", "prefix scan exclusive"],
    "inputs": [
        {"id": "container", "label": "Source Container", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "result", "label": "Destination Container", "type": "string", "default": "pref", "validation": cpp_var_validation},
        {"id": "init", "label": "Initial Value", "type": "string", "default": "0"}
    ],
    "template": "exclusive_scan({{container}}.begin(), {{container}}.end(), {{result}}.begin(), {{init}});"
})

# iota
algorithms.append({
    "id": "algorithm-iota",
    "title": "iota",
    "category": "STL Algorithms (Numeric)",
    "aliases": ["iota", "fill sequential", "range fill"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "start", "label": "Start Value", "type": "string", "default": "0"}
    ],
    "template": "iota({{container}}.begin(), {{container}}.end(), {{start}});"
})

# inner_product
algorithms.append({
    "id": "algorithm-inner-product",
    "title": "inner_product",
    "category": "STL Algorithms (Numeric)",
    "aliases": ["inner product", "dot product", "product sum"],
    "inputs": [
        {"id": "c1", "label": "Container 1 (Source)", "type": "string", "default": "v1", "validation": cpp_var_validation},
        {"id": "c2", "label": "Container 2 (Source)", "type": "string", "default": "v2", "validation": cpp_var_validation},
        {"id": "init", "label": "Initial Value", "type": "string", "default": "0"}
    ],
    "template": "auto dot_prod = inner_product({{c1}}.begin(), {{c1}}.end(), {{c2}}.begin(), {{init}});"
})

# gcd
algorithms.append({
    "id": "algorithm-gcd",
    "title": "gcd",
    "category": "STL Algorithms (Numeric)",
    "aliases": ["gcd", "greatest common divisor", "math"],
    "inputs": [
        {"id": "v1", "label": "Value A", "type": "string", "default": "a"},
        {"id": "v2", "label": "Value B", "type": "string", "default": "b"}
    ],
    "template": "auto val = std::gcd({{v1}}, {{v2}});"
})

# lcm
algorithms.append({
    "id": "algorithm-lcm",
    "title": "lcm",
    "category": "STL Algorithms (Numeric)",
    "aliases": ["lcm", "least common multiple", "math"],
    "inputs": [
        {"id": "v1", "label": "Value A", "type": "string", "default": "a"},
        {"id": "v2", "label": "Value B", "type": "string", "default": "b"}
    ],
    "template": "auto val = std::lcm({{v1}}, {{v2}});"
})


# 4. MIN / MAX
# min
algorithms.append({
    "id": "algorithm-min",
    "title": "min",
    "category": "STL Algorithms (Min/Max)",
    "aliases": ["min", "minimum", "smallest"],
    "inputs": [
        {"id": "type", "label": "Input Mode", "type": "select", "options": ["Two Values", "Initializer List"], "default": "Two Values"},
        {"id": "a", "label": "Value A", "type": "string", "default": "a", "condition": "type === 'Two Values'"},
        {"id": "b", "label": "Value B", "type": "string", "default": "b", "condition": "type === 'Two Values'"},
        {"id": "list", "label": "Comma Separated Values", "type": "string", "default": "a, b, c", "condition": "type === 'Initializer List'"}
    ],
    "templates": [
        {"condition": "type === 'Two Values'", "value": "auto val = std::min({{a}}, {{b}});"},
        {"condition": "type === 'Initializer List'", "value": "auto val = std::min({ {{list}} });"}
    ]
})

# max
algorithms.append({
    "id": "algorithm-max",
    "title": "max",
    "category": "STL Algorithms (Min/Max)",
    "aliases": ["max", "maximum", "largest"],
    "inputs": [
        {"id": "type", "label": "Input Mode", "type": "select", "options": ["Two Values", "Initializer List"], "default": "Two Values"},
        {"id": "a", "label": "Value A", "type": "string", "default": "a", "condition": "type === 'Two Values'"},
        {"id": "b", "label": "Value B", "type": "string", "default": "b", "condition": "type === 'Two Values'"},
        {"id": "list", "label": "Comma Separated Values", "type": "string", "default": "a, b, c", "condition": "type === 'Initializer List'"}
    ],
    "templates": [
        {"condition": "type === 'Two Values'", "value": "auto val = std::max({{a}}, {{b}});"},
        {"condition": "type === 'Initializer List'", "value": "auto val = std::max({ {{list}} });"}
    ]
})

# minmax
algorithms.append({
    "id": "algorithm-minmax",
    "title": "minmax",
    "category": "STL Algorithms (Min/Max)",
    "aliases": ["minmax", "both min max"],
    "inputs": [
        {"id": "type", "label": "Input Mode", "type": "select", "options": ["Two Values", "Initializer List"], "default": "Two Values"},
        {"id": "a", "label": "Value A", "type": "string", "default": "a", "condition": "type === 'Two Values'"},
        {"id": "b", "label": "Value B", "type": "string", "default": "b", "condition": "type === 'Two Values'"},
        {"id": "list", "label": "Comma Separated Values", "type": "string", "default": "a, b, c", "condition": "type === 'Initializer List'"}
    ],
    "templates": [
        {"condition": "type === 'Two Values'", "value": "auto [min_val, max_val] = std::minmax({{a}}, {{b}});"},
        {"condition": "type === 'Initializer List'", "value": "auto [min_val, max_val] = std::minmax({ {{list}} });"}
    ]
})

# min_element
algorithms.append({
    "id": "algorithm-min-element",
    "title": "min_element",
    "category": "STL Algorithms (Min/Max)",
    "aliases": ["min_element", "minimum index", "smallest element iterator"],
    "inputs": [{"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation}],
    "template": "auto it = min_element({{container}}.begin(), {{container}}.end());"
})

# max_element
algorithms.append({
    "id": "algorithm-max-element",
    "title": "max_element",
    "category": "STL Algorithms (Min/Max)",
    "aliases": ["max_element", "maximum index", "largest element iterator"],
    "inputs": [{"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation}],
    "template": "auto it = max_element({{container}}.begin(), {{container}}.end());"
})

# minmax_element
algorithms.append({
    "id": "algorithm-minmax-element",
    "title": "minmax_element",
    "category": "STL Algorithms (Min/Max)",
    "aliases": ["minmax_element", "both smallest largest iterators"],
    "inputs": [{"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation}],
    "template": "auto [min_it, max_it] = minmax_element({{container}}.begin(), {{container}}.end());"
})

# clamp
algorithms.append({
    "id": "algorithm-clamp",
    "title": "clamp",
    "category": "STL Algorithms (Min/Max)",
    "aliases": ["clamp", "boundary restrict"],
    "inputs": [
        {"id": "val", "label": "Target Value", "type": "string", "default": "x"},
        {"id": "lo", "label": "Lower Bound (Min Allowed)", "type": "string", "default": "0"},
        {"id": "hi", "label": "Upper Bound (Max Allowed)", "type": "string", "default": "N"}
    ],
    "template": "auto val = std::clamp({{val}}, {{lo}}, {{hi}});"
})


# 5. COUNTING
# count
algorithms.append({
    "id": "algorithm-count",
    "title": "count",
    "category": "STL Algorithms (Counting)",
    "aliases": ["count", "occurrences"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "value", "label": "Target Value", "type": "string", "default": "x"}
    ],
    "template": "int cnt = count({{container}}.begin(), {{container}}.end(), {{value}});"
})

# count_if
algorithms.append({
    "id": "algorithm-count-if",
    "title": "count_if",
    "category": "STL Algorithms (Counting)",
    "aliases": ["count_if", "count matching"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "predicate", "label": "Predicate Function / Lambda", "type": "string", "default": "[](int x) { return x > 0; }"}
    ],
    "template": "int cnt = count_if({{container}}.begin(), {{container}}.end(), {{predicate}});"
})

# all_of
algorithms.append({
    "id": "algorithm-all-of",
    "title": "all_of",
    "category": "STL Algorithms (Counting)",
    "aliases": ["all_of", "all matching"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "predicate", "label": "Predicate Function / Lambda", "type": "string", "default": "[](int x) { return x > 0; }"}
    ],
    "template": "bool all = all_of({{container}}.begin(), {{container}}.end(), {{predicate}});"
})

# any_of
algorithms.append({
    "id": "algorithm-any-of",
    "title": "any_of",
    "category": "STL Algorithms (Counting)",
    "aliases": ["any_of", "any matching"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "predicate", "label": "Predicate Function / Lambda", "type": "string", "default": "[](int x) { return x > 0; }"}
    ],
    "template": "bool any = any_of({{container}}.begin(), {{container}}.end(), {{predicate}});"
})

# none_of
algorithms.append({
    "id": "algorithm-none-of",
    "title": "none_of",
    "category": "STL Algorithms (Counting)",
    "aliases": ["none_of", "none matching"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "predicate", "label": "Predicate Function / Lambda", "type": "string", "default": "[](int x) { return x < 0; }"}
    ],
    "template": "bool none = none_of({{container}}.begin(), {{container}}.end(), {{predicate}});"
})


# 6. SEARCHING
# find
algorithms.append({
    "id": "algorithm-find",
    "title": "find",
    "category": "STL Algorithms (Searching)",
    "aliases": ["find", "search", "locate"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "value", "label": "Target Value", "type": "string", "default": "x"}
    ],
    "template": "auto it = find({{container}}.begin(), {{container}}.end(), {{value}});"
})

# find_if
algorithms.append({
    "id": "algorithm-find-if",
    "title": "find_if",
    "category": "STL Algorithms (Searching)",
    "aliases": ["find_if", "find matching"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "predicate", "label": "Predicate Function / Lambda", "type": "string", "default": "[](int x) { return x > 0; }"}
    ],
    "template": "auto it = find_if({{container}}.begin(), {{container}}.end(), {{predicate}});"
})

# find_if_not
algorithms.append({
    "id": "algorithm-find-if-not",
    "title": "find_if_not",
    "category": "STL Algorithms (Searching)",
    "aliases": ["find_if_not", "find not matching"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "predicate", "label": "Predicate Function / Lambda", "type": "string", "default": "[](int x) { return x > 0; }"}
    ],
    "template": "auto it = find_if_not({{container}}.begin(), {{container}}.end(), {{predicate}});"
})

# search
algorithms.append({
    "id": "algorithm-search",
    "title": "search",
    "category": "STL Algorithms (Searching)",
    "aliases": ["search", "find subsequence", "match subrange"],
    "inputs": [
        {"id": "c1", "label": "Source Container", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "c2", "label": "Subsequence Container", "type": "string", "default": "s", "validation": cpp_var_validation}
    ],
    "template": "auto it = search({{c1}}.begin(), {{c1}}.end(), {{c2}}.begin(), {{c2}}.end());"
})

# search_n
algorithms.append({
    "id": "algorithm-search-n",
    "title": "search_n",
    "category": "STL Algorithms (Searching)",
    "aliases": ["search_n", "find consecutive", "consecutive count"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "count", "label": "Consecutive Count", "type": "string", "default": "n"},
        {"id": "value", "label": "Target Value", "type": "string", "default": "x"}
    ],
    "template": "auto it = search_n({{container}}.begin(), {{container}}.end(), {{count}}, {{value}});"
})

# adjacent_find
algorithms.append({
    "id": "algorithm-adjacent-find",
    "title": "adjacent_find",
    "category": "STL Algorithms (Searching)",
    "aliases": ["adjacent_find", "consecutive duplicate"],
    "inputs": [{"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation}],
    "template": "auto it = adjacent_find({{container}}.begin(), {{container}}.end());"
})

# find_end
algorithms.append({
    "id": "algorithm-find-end",
    "title": "find_end",
    "category": "STL Algorithms (Searching)",
    "aliases": ["find_end", "find last subsequence"],
    "inputs": [
        {"id": "c1", "label": "Source Container", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "c2", "label": "Subsequence Container", "type": "string", "default": "s", "validation": cpp_var_validation}
    ],
    "template": "auto it = find_end({{c1}}.begin(), {{c1}}.end(), {{c2}}.begin(), {{c2}}.end());"
})

# find_first_of
algorithms.append({
    "id": "algorithm-find-first-of",
    "title": "find_first_of",
    "category": "STL Algorithms (Searching)",
    "aliases": ["find_first_of", "first match in targets"],
    "inputs": [
        {"id": "c1", "label": "Source Container", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "c2", "label": "Targets Container", "type": "string", "default": "targets", "validation": cpp_var_validation}
    ],
    "template": "auto it = find_first_of({{c1}}.begin(), {{c1}}.end(), {{c2}}.begin(), {{c2}}.end());"
})


# 7. MODIFICATION
# copy
algorithms.append({
    "id": "algorithm-copy",
    "title": "copy",
    "category": "STL Algorithms (Modification)",
    "aliases": ["copy", "duplicate range"],
    "inputs": [
        {"id": "source", "label": "Source Container", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "dest", "label": "Destination Container/Iterator", "type": "string", "default": "res", "validation": cpp_var_validation}
    ],
    "template": "copy({{source}}.begin(), {{source}}.end(), {{dest}}.begin());"
})

# copy_if
algorithms.append({
    "id": "algorithm-copy-if",
    "title": "copy_if",
    "category": "STL Algorithms (Modification)",
    "aliases": ["copy_if", "copy matching"],
    "inputs": [
        {"id": "source", "label": "Source Container", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "dest", "label": "Destination Container/Iterator", "type": "string", "default": "res", "validation": cpp_var_validation},
        {"id": "predicate", "label": "Predicate Function / Lambda", "type": "string", "default": "[](int x) { return x > 0; }"}
    ],
    "template": "copy_if({{source}}.begin(), {{source}}.end(), {{dest}}.begin(), {{predicate}});"
})

# copy_backward
algorithms.append({
    "id": "algorithm-copy-backward",
    "title": "copy_backward",
    "category": "STL Algorithms (Modification)",
    "aliases": ["copy_backward", "copy reverse destination"],
    "inputs": [
        {"id": "source", "label": "Source Container", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "destEnd", "label": "Destination End Iterator", "type": "string", "default": "res", "validation": cpp_var_validation}
    ],
    "template": "copy_backward({{source}}.begin(), {{source}}.end(), {{destEnd}}.end());"
})

# move
algorithms.append({
    "id": "algorithm-move",
    "title": "move",
    "category": "STL Algorithms (Modification)",
    "aliases": ["move", "transfer range"],
    "inputs": [
        {"id": "source", "label": "Source Container", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "dest", "label": "Destination Container/Iterator", "type": "string", "default": "res", "validation": cpp_var_validation}
    ],
    "template": "move({{source}}.begin(), {{source}}.end(), {{dest}}.begin());"
})

# fill
algorithms.append({
    "id": "algorithm-fill",
    "title": "fill",
    "category": "STL Algorithms (Modification)",
    "aliases": ["fill", "initialize all"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "value", "label": "Fill Value", "type": "string", "default": "0"}
    ],
    "template": "fill({{container}}.begin(), {{container}}.end(), {{value}});"
})

# fill_n
algorithms.append({
    "id": "algorithm-fill-n",
    "title": "fill_n",
    "category": "STL Algorithms (Modification)",
    "aliases": ["fill_n", "initialize n elements"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "count", "label": "Element Count", "type": "string", "default": "n"},
        {"id": "value", "label": "Fill Value", "type": "string", "default": "0"}
    ],
    "template": "fill_n({{container}}.begin(), {{count}}, {{value}});"
})

# generate
algorithms.append({
    "id": "algorithm-generate",
    "title": "generate",
    "category": "STL Algorithms (Modification)",
    "aliases": ["generate", "fill generated values"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "generator", "label": "Generator Function / Lambda", "type": "string", "default": "rand"}
    ],
    "template": "generate({{container}}.begin(), {{container}}.end(), {{generator}});"
})

# generate_n
algorithms.append({
    "id": "algorithm-generate-n",
    "title": "generate_n",
    "category": "STL Algorithms (Modification)",
    "aliases": ["generate_n", "fill generated values n elements"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "count", "label": "Element Count", "type": "string", "default": "n"},
        {"id": "generator", "label": "Generator Function / Lambda", "type": "string", "default": "rand"}
    ],
    "template": "generate_n({{container}}.begin(), {{count}}, {{generator}});"
})

# replace
algorithms.append({
    "id": "algorithm-replace",
    "title": "replace",
    "category": "STL Algorithms (Modification)",
    "aliases": ["replace", "swap values in range"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "oldVal", "label": "Old Value to Replace", "type": "string", "default": "old_x"},
        {"id": "newVal", "label": "New Value", "type": "string", "default": "new_x"}
    ],
    "template": "replace({{container}}.begin(), {{container}}.end(), {{oldVal}}, {{newVal}});"
})

# replace_if
algorithms.append({
    "id": "algorithm-replace-if",
    "title": "replace_if",
    "category": "STL Algorithms (Modification)",
    "aliases": ["replace_if", "replace matching values"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "predicate", "label": "Predicate Function / Lambda", "type": "string", "default": "[](int x) { return x < 0; }"},
        {"id": "newVal", "label": "New Value", "type": "string", "default": "0"}
    ],
    "template": "replace_if({{container}}.begin(), {{container}}.end(), {{predicate}}, {{newVal}});"
})

# swap
algorithms.append({
    "id": "algorithm-swap",
    "title": "swap",
    "category": "STL Algorithms (Modification)",
    "aliases": ["swap", "interchange"],
    "inputs": [
        {"id": "v1", "label": "Variable A", "type": "string", "default": "a"},
        {"id": "v2", "label": "Variable B", "type": "string", "default": "b"}
    ],
    "template": "swap({{v1}}, {{v2}});"
})

# swap_ranges
algorithms.append({
    "id": "algorithm-swap-ranges",
    "title": "swap_ranges",
    "category": "STL Algorithms (Modification)",
    "aliases": ["swap_ranges", "swap two ranges"],
    "inputs": [
        {"id": "c1", "label": "Container 1", "type": "string", "default": "v1", "validation": cpp_var_validation},
        {"id": "c2", "label": "Container 2 (Destination)", "type": "string", "default": "v2", "validation": cpp_var_validation}
    ],
    "template": "swap_ranges({{c1}}.begin(), {{c1}}.end(), {{c2}}.begin());"
})

# transform
algorithms.append({
    "id": "algorithm-transform",
    "title": "transform",
    "category": "STL Algorithms (Modification)",
    "aliases": ["transform", "apply function to range", "map"],
    "inputs": [
        {"id": "mode", "label": "Operation Mode", "type": "select", "options": ["Unary (1 Container)", "Binary (2 Containers)"], "default": "Unary (1 Container)"},
        {"id": "c1", "label": "Source Container 1", "type": "string", "default": "v1", "validation": cpp_var_validation},
        {"id": "c2", "label": "Source Container 2", "type": "string", "default": "v2", "validation": cpp_var_validation, "condition": "mode === 'Binary (2 Containers)'"},
        {"id": "dest", "label": "Destination Container/Iterator", "type": "string", "default": "res", "validation": cpp_var_validation},
        {"id": "func", "label": "Function / Lambda Operator", "type": "string", "default": "[](int x) { return x * 2; }"}
    ],
    "templates": [
        {"condition": "mode === 'Unary (1 Container)'", "value": "transform({{c1}}.begin(), {{c1}}.end(), {{dest}}.begin(), {{func}});"},
        {"condition": "mode === 'Binary (2 Containers)'", "value": "transform({{c1}}.begin(), {{c1}}.end(), {{c2}}.begin(), {{dest}}.begin(), {{func}});"}
    ]
})


# 8. REMOVAL
# remove
algorithms.append({
    "id": "algorithm-remove",
    "title": "remove",
    "category": "STL Algorithms (Removal)",
    "aliases": ["remove", "shift matches out"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "value", "label": "Target Value to Remove", "type": "string", "default": "x"}
    ],
    "template": "auto new_end = remove({{container}}.begin(), {{container}}.end(), {{value}});"
})

# remove_if
algorithms.append({
    "id": "algorithm-remove-if",
    "title": "remove_if",
    "category": "STL Algorithms (Removal)",
    "aliases": ["remove_if", "remove matching"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "predicate", "label": "Predicate Function / Lambda", "type": "string", "default": "[](int x) { return x % 2 == 0; }"}
    ],
    "template": "auto new_end = remove_if({{container}}.begin(), {{container}}.end(), {{predicate}});"
})

# remove_copy
algorithms.append({
    "id": "algorithm-remove-copy",
    "title": "remove_copy",
    "category": "STL Algorithms (Removal)",
    "aliases": ["remove_copy", "copy without value"],
    "inputs": [
        {"id": "source", "label": "Source Container", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "dest", "label": "Destination Container/Iterator", "type": "string", "default": "res", "validation": cpp_var_validation},
        {"id": "value", "label": "Target Value to Exclude", "type": "string", "default": "x"}
    ],
    "template": "remove_copy({{source}}.begin(), {{source}}.end(), {{dest}}.begin(), {{value}});"
})

# remove_copy_if
algorithms.append({
    "id": "algorithm-remove-copy-if",
    "title": "remove_copy_if",
    "category": "STL Algorithms (Removal)",
    "aliases": ["remove_copy_if", "copy without matching"],
    "inputs": [
        {"id": "source", "label": "Source Container", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "dest", "label": "Destination Container/Iterator", "type": "string", "default": "res", "validation": cpp_var_validation},
        {"id": "predicate", "label": "Predicate Function / Lambda", "type": "string", "default": "[](int x) { return x < 0; }"}
    ],
    "template": "remove_copy_if({{source}}.begin(), {{source}}.end(), {{dest}}.begin(), {{predicate}});"
})

# unique
algorithms.append({
    "id": "algorithm-unique",
    "title": "unique",
    "category": "STL Algorithms (Removal)",
    "aliases": ["unique", "distinct", "remove duplicates consecutive"],
    "inputs": [{"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation}],
    "template": "auto new_end = unique({{container}}.begin(), {{container}}.end());"
})

# unique_copy
algorithms.append({
    "id": "algorithm-unique-copy",
    "title": "unique_copy",
    "category": "STL Algorithms (Removal)",
    "aliases": ["unique_copy", "copy unique consecutive", "unique"],
    "inputs": [
        {"id": "source", "label": "Source Container", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "dest", "label": "Destination Container/Iterator", "type": "string", "default": "res", "validation": cpp_var_validation}
    ],
    "template": "unique_copy({{source}}.begin(), {{source}}.end(), {{dest}}.begin());"
})

# erase-remove idiom
algorithms.append({
    "id": "algorithm-erase-remove-idiom",
    "title": "erase-remove idiom",
    "category": "STL Algorithms (Removal)",
    "aliases": ["erase-remove", "erase", "remove", "unique", "distinct", "erase remove idiom"],
    "inputs": [
        {"id": "mode", "label": "Removal Criteria", "type": "select", "options": ["Specific Value", "Conditional Predicate"], "default": "Specific Value"},
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "value", "label": "Target Value to Remove", "type": "string", "default": "x", "condition": "mode === 'Specific Value'"},
        {"id": "predicate", "label": "Predicate Function / Lambda", "type": "string", "default": "[](int x) { return x % 2 == 0; }", "condition": "mode === 'Conditional Predicate'"}
    ],
    "templates": [
        {"condition": "mode === 'Specific Value'", "value": "{{container}}.erase(remove({{container}}.begin(), {{container}}.end(), {{value}}), {{container}}.end());"},
        {"condition": "mode === 'Conditional Predicate'", "value": "{{container}}.erase(remove_if({{container}}.begin(), {{container}}.end(), {{predicate}}), {{container}}.end());"}
    ]
})


# 9. PERMUTATIONS
# next_permutation
algorithms.append({
    "id": "algorithm-next-permutation",
    "title": "next_permutation",
    "category": "STL Algorithms (Permutations)",
    "aliases": ["next_permutation", "perm", "lexicographical next permutation", "permutation"],
    "inputs": [{"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation}],
    "template": "next_permutation({{container}}.begin(), {{container}}.end())"
})

# prev_permutation
algorithms.append({
    "id": "algorithm-prev-permutation",
    "title": "prev_permutation",
    "category": "STL Algorithms (Permutations)",
    "aliases": ["prev_permutation", "perm", "lexicographical prev permutation", "permutation"],
    "inputs": [{"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation}],
    "template": "prev_permutation({{container}}.begin(), {{container}}.end())"
})

# reverse
algorithms.append({
    "id": "algorithm-reverse",
    "title": "reverse",
    "category": "STL Algorithms (Permutations)",
    "aliases": ["reverse", "invert"],
    "inputs": [{"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation}],
    "template": "reverse({{container}}.begin(), {{container}}.end());"
})

# reverse_copy
algorithms.append({
    "id": "algorithm-reverse-copy",
    "title": "reverse_copy",
    "category": "STL Algorithms (Permutations)",
    "aliases": ["reverse_copy", "copy inverted"],
    "inputs": [
        {"id": "source", "label": "Source Container", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "dest", "label": "Destination Container/Iterator", "type": "string", "default": "res", "validation": cpp_var_validation}
    ],
    "template": "reverse_copy({{source}}.begin(), {{source}}.end(), {{dest}}.begin());"
})

# rotate
algorithms.append({
    "id": "algorithm-rotate",
    "title": "rotate",
    "category": "STL Algorithms (Permutations)",
    "aliases": ["rotate", "shift pivot"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "middle", "label": "Shift/Pivot Offset (from begin)", "type": "string", "default": "k"}
    ],
    "template": "rotate({{container}}.begin(), {{container}}.begin() + {{middle}}, {{container}}.end());"
})

# rotate_copy
algorithms.append({
    "id": "algorithm-rotate-copy",
    "title": "rotate_copy",
    "category": "STL Algorithms (Permutations)",
    "aliases": ["rotate_copy", "copy rotated"],
    "inputs": [
        {"id": "source", "label": "Source Container", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "middle", "label": "Shift/Pivot Offset (from begin)", "type": "string", "default": "k"},
        {"id": "dest", "label": "Destination Container/Iterator", "type": "string", "default": "res", "validation": cpp_var_validation}
    ],
    "template": "rotate_copy({{source}}.begin(), {{source}}.begin() + {{middle}}, {{source}}.end(), {{dest}}.begin());"
})

# shuffle
algorithms.append({
    "id": "algorithm-shuffle",
    "title": "shuffle",
    "category": "STL Algorithms (Permutations)",
    "aliases": ["shuffle", "randomize"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "rng", "label": "Random Number Generator Engine", "type": "string", "default": "rng"}
    ],
    "template": "shuffle({{container}}.begin(), {{container}}.end(), {{rng}});"
})


# 10. MERGING
# merge
algorithms.append({
    "id": "algorithm-merge",
    "title": "merge",
    "category": "STL Algorithms (Merging)",
    "aliases": ["merge", "combine sorted"],
    "inputs": [
        {"id": "c1", "label": "Sorted Container A", "type": "string", "default": "v1", "validation": cpp_var_validation},
        {"id": "c2", "label": "Sorted Container B", "type": "string", "default": "v2", "validation": cpp_var_validation},
        {"id": "dest", "label": "Destination Container/Iterator", "type": "string", "default": "res", "validation": cpp_var_validation}
    ],
    "template": "merge({{c1}}.begin(), {{c1}}.end(), {{c2}}.begin(), {{c2}}.end(), {{dest}}.begin());"
})

# inplace_merge
algorithms.append({
    "id": "algorithm-inplace-merge",
    "title": "inplace_merge",
    "category": "STL Algorithms (Merging)",
    "aliases": ["inplace_merge", "merge contiguous parts"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "middle", "label": "Middle Boundary Offset (from begin)", "type": "string", "default": "k"}
    ],
    "template": "inplace_merge({{container}}.begin(), {{container}}.begin() + {{middle}}, {{container}}.end());"
})

# set_union
algorithms.append({
    "id": "algorithm-set-union",
    "title": "set_union",
    "category": "STL Algorithms (Merging)",
    "aliases": ["set_union", "union math sorted"],
    "inputs": [
        {"id": "c1", "label": "Sorted Container A", "type": "string", "default": "v1", "validation": cpp_var_validation},
        {"id": "c2", "label": "Sorted Container B", "type": "string", "default": "v2", "validation": cpp_var_validation},
        {"id": "dest", "label": "Destination Container/Iterator", "type": "string", "default": "res", "validation": cpp_var_validation}
    ],
    "template": "set_union({{c1}}.begin(), {{c1}}.end(), {{c2}}.begin(), {{c2}}.end(), {{dest}}.begin());"
})

# set_intersection
algorithms.append({
    "id": "algorithm-set-intersection",
    "title": "set_intersection",
    "category": "STL Algorithms (Merging)",
    "aliases": ["set_intersection", "intersection math sorted"],
    "inputs": [
        {"id": "c1", "label": "Sorted Container A", "type": "string", "default": "v1", "validation": cpp_var_validation},
        {"id": "c2", "label": "Sorted Container B", "type": "string", "default": "v2", "validation": cpp_var_validation},
        {"id": "dest", "label": "Destination Container/Iterator", "type": "string", "default": "res", "validation": cpp_var_validation}
    ],
    "template": "set_intersection({{c1}}.begin(), {{c1}}.end(), {{c2}}.begin(), {{c2}}.end(), {{dest}}.begin());"
})

# set_difference
algorithms.append({
    "id": "algorithm-set-difference",
    "title": "set_difference",
    "category": "STL Algorithms (Merging)",
    "aliases": ["set_difference", "difference math sorted"],
    "inputs": [
        {"id": "c1", "label": "Sorted Container A", "type": "string", "default": "v1", "validation": cpp_var_validation},
        {"id": "c2", "label": "Sorted Container B", "type": "string", "default": "v2", "validation": cpp_var_validation},
        {"id": "dest", "label": "Destination Container/Iterator", "type": "string", "default": "res", "validation": cpp_var_validation}
    ],
    "template": "set_difference({{c1}}.begin(), {{c1}}.end(), {{c2}}.begin(), {{c2}}.end(), {{dest}}.begin());"
})

# set_symmetric_difference
algorithms.append({
    "id": "algorithm-set-symmetric-difference",
    "title": "set_symmetric_difference",
    "category": "STL Algorithms (Merging)",
    "aliases": ["set_symmetric_difference", "symmetric difference math sorted"],
    "inputs": [
        {"id": "c1", "label": "Sorted Container A", "type": "string", "default": "v1", "validation": cpp_var_validation},
        {"id": "c2", "label": "Sorted Container B", "type": "string", "default": "v2", "validation": cpp_var_validation},
        {"id": "dest", "label": "Destination Container/Iterator", "type": "string", "default": "res", "validation": cpp_var_validation}
    ],
    "template": "set_symmetric_difference({{c1}}.begin(), {{c1}}.end(), {{c2}}.begin(), {{c2}}.end(), {{dest}}.begin());"
})


# 11. HEAP ALGORITHMS
# make_heap
algorithms.append({
    "id": "algorithm-make-heap",
    "title": "make_heap",
    "category": "STL Algorithms (Heap)",
    "aliases": ["heap", "make_heap", "priority queue", "make heap"],
    "inputs": [{"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation}],
    "template": "make_heap({{container}}.begin(), {{container}}.end());"
})

# push_heap
algorithms.append({
    "id": "algorithm-push-heap",
    "title": "push_heap",
    "category": "STL Algorithms (Heap)",
    "aliases": ["heap", "push_heap", "priority queue", "push heap"],
    "inputs": [{"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation}],
    "template": "push_heap({{container}}.begin(), {{container}}.end());"
})

# pop_heap
algorithms.append({
    "id": "algorithm-pop-heap",
    "title": "pop_heap",
    "category": "STL Algorithms (Heap)",
    "aliases": ["heap", "pop_heap", "priority queue", "pop heap"],
    "inputs": [{"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation}],
    "template": "pop_heap({{container}}.begin(), {{container}}.end());"
})

# sort_heap
algorithms.append({
    "id": "algorithm-sort-heap",
    "title": "sort_heap",
    "category": "STL Algorithms (Heap)",
    "aliases": ["heap", "sort_heap", "priority queue", "sort heap"],
    "inputs": [{"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation}],
    "template": "sort_heap({{container}}.begin(), {{container}}.end());"
})

# is_heap
algorithms.append({
    "id": "algorithm-is-heap",
    "title": "is_heap",
    "category": "STL Algorithms (Heap)",
    "aliases": ["heap", "is_heap", "check heap", "is heap"],
    "inputs": [{"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation}],
    "template": "bool heapified = is_heap({{container}}.begin(), {{container}}.end());"
})

# is_heap_until
algorithms.append({
    "id": "algorithm-is-heap-until",
    "title": "is_heap_until",
    "category": "STL Algorithms (Heap)",
    "aliases": ["heap", "is_heap_until", "heap boundary", "is heap until"],
    "inputs": [{"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation}],
    "template": "auto first_non_heap = is_heap_until({{container}}.begin(), {{container}}.end());"
})


# 12. RANGES / ITERATOR HELPERS
# for_each
algorithms.append({
    "id": "algorithm-for-each",
    "title": "for_each",
    "category": "STL Algorithms (Ranges)",
    "aliases": ["for_each", "iterate elements", "loop", "for each"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "lambda", "label": "Lambda Operation / Function", "type": "string", "default": "[](auto& x) { cout << x << ' '; }"}
    ],
    "template": "for_each({{container}}.begin(), {{container}}.end(), {{lambda}});"
})

# for_each_n
algorithms.append({
    "id": "algorithm-for-each-n",
    "title": "for_each_n",
    "category": "STL Algorithms (Ranges)",
    "aliases": ["for_each_n", "iterate n elements", "loop count", "for each n"],
    "inputs": [
        {"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation},
        {"id": "count", "label": "Element Count", "type": "string", "default": "n"},
        {"id": "lambda", "label": "Lambda Operation / Function", "type": "string", "default": "[](auto& x) { cout << x << ' '; }"}
    ],
    "template": "for_each_n({{container}}.begin(), {{count}}, {{lambda}});"
})

# distance
algorithms.append({
    "id": "algorithm-distance",
    "title": "distance",
    "category": "STL Algorithms (Ranges)",
    "aliases": ["distance", "iterator difference", "length between"],
    "inputs": [
        {"id": "it1", "label": "Start Iterator", "type": "string", "default": "v.begin()"},
        {"id": "it2", "label": "End Iterator", "type": "string", "default": "it"}
    ],
    "template": "auto dist = distance({{it1}}, {{it2}});"
})

# advance
algorithms.append({
    "id": "algorithm-advance",
    "title": "advance",
    "category": "STL Algorithms (Ranges)",
    "aliases": ["advance", "shift iterator"],
    "inputs": [
        {"id": "iterator", "label": "Iterator Variable", "type": "string", "default": "it"},
        {"id": "shift", "label": "Shift Distance", "type": "string", "default": "n"}
    ],
    "template": "advance({{iterator}}, {{shift}});"
})

# begin / end helper utilities
for helper in ["begin", "end", "cbegin", "cend", "rbegin", "rend"]:
    algorithms.append({
        "id": f"algorithm-{helper}",
        "title": helper,
        "category": "STL Algorithms (Ranges)",
        "aliases": [helper, f"std::{helper}", "iterator boundary"],
        "inputs": [{"id": "container", "label": "Container Variable", "type": "string", "default": "v", "validation": cpp_var_validation}],
        "template": f"{helper}({{{{container}}}})"
    })

# Output every single schema to its own JSON file
for algo in algorithms:
    filename = f"{algo['title'].replace(' ', '_').replace('-', '_')}.json"
    filepath = os.path.join(target_dir, filename)
    with open(filepath, "w") as out:
        json.dump(algo, out, indent=2)

print(f"Generated {len(algorithms)} STL algorithm generator schemas.")
