'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TreeItemCollapsibleState } from 'vscode';

export function isMoodleDirectory(dir: string) {
    return fs.existsSync(path.join(dir, 'version.php'));
}

export function isMoodlePluginDirectory(dir: string) {
    return fs.existsSync(path.join(dir, 'version.php'));
}

export class CoreComponent {

    // TODO: Shouldn't be public, but we're using it in the provider at the moment.
    constructor(public moodleRoot: string) {
        console.log(moodleRoot);
    }

    fetchPlugintypes(): { [name: string]: string; } {
        let types: { [name: string]: string; } = {
            'antivirus': 'lib/antivirus',
            'availability': 'availability/condition',
            'qtype': 'question/type',
            'mod': 'mod',
            'auth': 'auth',
            'calendartype': 'calendar/type',
            'enrol': 'enrol',
            'message': 'message/output',
            'block': 'blocks',
            'media': 'media/player',
            'filter': 'filter',
            'editor': 'lib/editor',
            'format': 'course/format',
            'dataformat': 'dataformat',
            'profilefield': 'user/profile/field',
            'report': 'report',
            'coursereport': 'course/report', // Must be after system reports.
            'gradeexport': 'grade/export',
            'gradeimport': 'grade/import',
            'gradereport': 'grade/report',
            'gradingform': 'grade/grading/form',
            'mlbackend': 'lib/mlbackend',
            'mnetservice': 'mnet/service',
            'webservice': 'webservice',
            'repository': 'repository',
            'portfolio': 'portfolio',
            'search': 'search/engine',
            'qbehaviour': 'question/behaviour',
            'qformat': 'question/format',
            'plagiarism': 'plagiarism',
            // TODO: Support custom admin directory.
            'tool': 'admin/tool',
            'cachestore': 'cache/stores',
            'cachelock': 'cache/locks',
            'fileconverter': 'files/converter',

            // Theme not in array in Moodle PHP.
            // TODO: Support custom theme directory.
            'theme': 'theme',
            // Local not in array in Moodle PHP.
            'local': 'local'
        };

        // TODO: Support subtypes.

        return types;
    }

}

class PluginTreeItem extends vscode.TreeItem {

    path: string = '';


}

class PluginTypeItem extends PluginTreeItem {

    collapsibleState = TreeItemCollapsibleState.Collapsed;

}

class PluginItem extends PluginTreeItem {

    collapsibleState = TreeItemCollapsibleState.Collapsed;
}

class PluginDetail extends PluginTreeItem {

}

export class PluginTreeDataProvider implements vscode.TreeDataProvider<PluginTreeItem> {

    constructor(protected component: CoreComponent) {

    }

    onDidChangeTreeData?: vscode.Event<PluginTreeItem | null | undefined> | undefined;

    getTreeItem(element: PluginTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: PluginTreeItem | undefined): vscode.ProviderResult<PluginTreeItem[]> {
        let items: PluginTreeItem[] = [];
        if (typeof element === 'undefined') {
            const pluginTypes = this.component.fetchPlugintypes();
            for (let key in pluginTypes) {
                let pluginType = new PluginTypeItem(key);
                pluginType.path = path.join(this.component.moodleRoot, pluginTypes[key]);
                items.push(pluginType);
            }
            return items;
        } else if (element instanceof PluginTypeItem) {
            if (fs.existsSync(element.path)) {
                const dirs = fs.readdirSync(element.path);
                dirs.forEach(dir => {
                    const pluginPath = path.join(element.path, dir);
                    if (isMoodlePluginDirectory(pluginPath)) {
                        const plugin = new PluginItem(dir);
                        plugin.path = pluginPath;
                        items.push(plugin);
                    }

                });

            }

        } else if (element instanceof PluginItem) {
            let moduleName = new PluginDetail('Module name: Yer module');
            let detail = new PluginDetail('Version: 2014120100');
            items.push(moduleName, detail);
        }
        return items;
    }

}