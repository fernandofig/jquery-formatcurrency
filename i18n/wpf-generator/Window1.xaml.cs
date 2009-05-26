using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using forms = System.Windows.Forms;
using io = System.IO;

namespace wpf_generator
{
    /// <summary>
    /// Interaction logic for Window1.xaml
    /// </summary>
    public partial class Window1 : Window
    {
        public ObservableCollection<CountryInfo> Cultures
        {
            get { return (ObservableCollection<CountryInfo>)GetValue(CountriesProperty); }
            set { SetValue(CountriesProperty, value); }
        }

        // Using a DependencyProperty as the backing store for Cultures.  This enables animation, styling, binding, etc...
        public static readonly DependencyProperty CountriesProperty =
            DependencyProperty.Register("Countries", typeof(ObservableCollection<CountryInfo>), typeof(Window1), new UIPropertyMetadata(null));




        public ObservableCollection<RegionFileInfo> Files
        {
            get { return (ObservableCollection<RegionFileInfo>)GetValue(FilesProperty); }
            set { SetValue(FilesProperty, value); }
        }

        // Using a DependencyProperty as the backing store for Files.  This enables animation, styling, binding, etc...
        public static readonly DependencyProperty FilesProperty =
            DependencyProperty.Register("Files", typeof(ObservableCollection<RegionFileInfo>), typeof(Window1), new UIPropertyMetadata(null));


        

        public Window1()
        {
            InitializeComponent();

            var path = "../";
#if DEBUG
            path = "../../../";
#endif

            var i18nFolder = new Uri(new Uri(AppDomain.CurrentDomain.BaseDirectory), path).LocalPath;
            this.OutputFolder.Text = i18nFolder;
            this.MergeOutputFile.Text = io::Path.Combine(i18nFolder, "jquery.formatCurrency.all.js");
            this.MergeInputFolder.Text = i18nFolder;

            LoadCultures();
            this.GenerateTab.DataContext = Cultures;

            LoadFiles();
            this.MergeTab.DataContext = Files;

            var licenseFile = io::Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "LicenseHeader.txt");
            LoadLicense(licenseFile);
        }

        private void LoadCultures()
        {
            Cultures = new ObservableCollection<CountryInfo>();
            foreach(var ci in Localization.Cultures.OrderBy(c => c.Code))
                Cultures.Add(ci);
        }


        private void LoadFiles()
        {
            if (Files == null)
                Files = new ObservableCollection<RegionFileInfo>();

            Files.Clear();

            if (!io::Directory.Exists(this.MergeInputFolder.Text))
                return;


            foreach (var file in io::Directory.GetFiles(this.MergeInputFolder.Text))
            {
                if (file.EndsWith("all.js")) continue;
                if (!file.EndsWith(".js")) continue;

                Files.Add(new RegionFileInfo { FullFilename = file });
            }
        }


        private void LoadLicense(string file)
        {
            using (var license = io::File.OpenText(file))
            {
                this.LicenseInfo.Text = license.ReadToEnd();
            }
        }

        private void Run_Click(object sender, RoutedEventArgs e)
        {
            foreach(var c in Cultures)
            {
                if (!c.IsSelected) continue;

                string output = io::Path.Combine(this.OutputFolder.Text, "jquery.formatCurrency." + c.Code + ".js");
                using (var writer = new StreamWriter(output, false, Encoding.UTF8))
                {
                    if (this.AddLicense.IsChecked ?? true)
                        WriteLicense(writer);
                        
                    WriteJQueryHeader(writer);

                    var ci = new System.Globalization.CultureInfo(c.Code);
                    writer.Write("\t$.formatCurrency.regions['{0}'] = ", c.Code);
                    writer.Write(Localization.CurrencyFormat(ci.NumberFormat));
                    writer.WriteLine(";\n");
                    
                    WriteJQueryFooter(writer);

                }
            }
            MessageBox.Show("Done");
            LoadFiles();
        }

        private void Merge_Click(object sender, RoutedEventArgs e)
        {
            var fi = new io::FileInfo(this.MergeOutputFile.Text);
            if (fi.Exists)
            {
                if(MessageBox.Show("File already exists. Overwrite?", "Overwrite?", MessageBoxButton.YesNo) == MessageBoxResult.Yes)
                {
                    fi.Delete();
                }
                else
                {
                    return;
                }
            }

            using (var outputFile = new StreamWriter(fi.FullName, false, Encoding.UTF8))
            {
                if (this.MergeAddLicense.IsChecked ?? true)
                    WriteLicense(outputFile);

                WriteJQueryHeader(outputFile);

                foreach (var file in Files)
                {
                    if (!file.IsSelected) 
                        continue;

                    outputFile.WriteLine(RegionInfoParser.GetFromFile(file.FullFilename));
                }

                WriteJQueryFooter(outputFile);
            }
            MessageBox.Show("File's done");
        }

        private static void WriteJQueryHeader(TextWriter writer)
        {
            writer.WriteLine("(function($) {");
            writer.WriteLine();
        }

        private static void WriteJQueryFooter(TextWriter writer)
        {
            writer.WriteLine("})(jQuery);");
        }

        private void WriteLicense(TextWriter writer)
        {
            writer.WriteLine(this.LicenseInfo.Text);
            writer.WriteLine();
        }

        private void Browse_Click(object sender, RoutedEventArgs e)
        {
            var button = sender as Button;
            TextBox output;
            switch (button.Name)
            {
                case "MergeInputBrowse":
                    output = this.MergeInputFolder;
                    break;
                default:
                    output = this.OutputFolder;
                    break;
            }

            var fd = new forms::FolderBrowserDialog();
            fd.SelectedPath = output.Text;
            if (fd.ShowDialog() == forms::DialogResult.OK)
            {
                output.Text = fd.SelectedPath;
            }
        }

        private void SelectAll_Click(object sender, RoutedEventArgs e)
        {
            foreach (var c in this.Cultures)
            {
                c.IsSelected = this.SelectAll.IsChecked ?? false;
            }
        }

        private void MergeOutputBrowse_Click(object sender, RoutedEventArgs e)
        {
            var fd = new forms::SaveFileDialog();
            fd.FileName = this.MergeOutputFile.Text;
            if (fd.ShowDialog() == forms::DialogResult.OK)
            {
                MergeOutputFile.Text = fd.FileName;
            }
        }

        private void MergeInputFolder_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (this.IsLoaded)
                LoadFiles();
        }
    }
}
