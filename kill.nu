/usr/bin/ps aux | split row "\n" | split column -r " +" | drop 1 | where column11 !~ vscode and ($it.column11 =~ bun or $it.column11 =~ node) | par-each {|rec| $rec.column2 | into int | kill -9 $in}
