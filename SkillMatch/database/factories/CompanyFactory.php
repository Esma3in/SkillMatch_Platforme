<?php

namespace Database\Factories;

use App\Models\Ceo;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
    public function definition(): array
    {
        $companies = [
            [
                
                'name' => 'Obytes',
                'sector' => 'Information Technology',
                'files' => 'obytes_presentation.pdf',
                'logo' => 'https://images.unsplash.com/photo-1620283085438-8a3e4e396856?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Happy Smala',
                'sector' => 'Information Technology',
                'files' => 'happysmala_tech.pdf',
                'logo' => 'https://images.unsplash.com/photo-1599305445671-744b04b6e725?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'HPS (Hightech Payment Systems)',
                'sector' => 'Fintech & IT',
                'files' => 'hps_fintech.pdf',
                'logo' => 'https://images.unsplash.com/photo-1551288049-b5b8a44c6155?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Involys',
                'sector' => 'Software Development',
                'files' => 'involys_brochure.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Dial Technologies',
                'sector' => 'Information Technology',
                'files' => 'dialtech.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Alten Maroc',
                'sector' => 'Engineering & IT Services',
                'files' => 'alten_maroc.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Capgemini Maroc',
                'sector' => 'Consulting & Technology',
                'files' => 'capgemini_maroc.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'CGI Technologies',
                'sector' => 'IT Services',
                'files' => 'cgi_tech_profile.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Novelis',
                'sector' => 'Cloud & Data',
                'files' => 'novelis_cloud.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Intelcia IT Solutions',
                'sector' => 'IT Outsourcing',
                'files' => 'intelcia_itsolutions.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Numa Maroc',
                'sector' => 'Startup Incubator',
                'files' => 'numa_incubator.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'UXA Tech',
                'sector' => 'Web & App Development',
                'files' => 'uxa_brochure.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'xHub',
                'sector' => 'Software Development',
                'files' => 'xhub_profile.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Opinov8 Digital and Engineering Solutions',
                'sector' => 'Software Development',
                'files' => 'opinov8_solutions.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'MTDS',
                'sector' => 'IT Managed Services',
                'files' => 'mtds_services.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Munisys',
                'sector' => 'Cloud Consulting',
                'files' => 'munisys_cloud.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'IubiSoft',
                'sector' => 'Cybersecurity',
                'files' => 'iubisoft_cyber.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'VLink',
                'sector' => 'IT Services',
                'files' => 'vlink_it.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'SII Group Maroc',
                'sector' => 'Engineering & Consulting',
                'files' => 'sii_group.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'NoOps',
                'sector' => 'IT Strategy Consulting',
                'files' => 'noops_consulting.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Hills Soft',
                'sector' => 'Digital Marketing & IT',
                'files' => 'hills_soft.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Logigroup',
                'sector' => 'IT Consulting',
                'files' => 'logigroup_consult.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'MarocRank',
                'sector' => 'IT Services',
                'files' => 'marocrank_services.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Majjane',
                'sector' => 'Web Development',
                'files' => 'majjane_web.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'QuickTech',
                'sector' => 'Web & Mobile Development',
                'files' => 'quicktech_dev.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'TeraByte Software',
                'sector' => 'Software Development',
                'files' => 'terabyte_software.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'OnnVision',
                'sector' => 'Marketing & IT Consulting',
                'files' => 'onnvision_marketing.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'YES TO THE NET',
                'sector' => 'Web Development & IT Outsourcing',
                'files' => 'yestothenet.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Viix Digital',
                'sector' => 'Digital Marketing & Web Design',
                'files' => 'viix_digital.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'FGM Technologies',
                'sector' => 'Digital Agency',
                'files' => 'fgm_tech.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Yovista',
                'sector' => 'Digital Marketing & Web Development',
                'files' => 'yovista_marketing.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Tingis Web',
                'sector' => 'Software Development & Digital Marketing',
                'files' => 'tingis_web.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'FORNET',
                'sector' => 'IT Services',
                'files' => 'fornet_it.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Raviga Solutions',
                'sector' => 'ERP Consulting',
                'files' => 'raviga_erp.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Manzana.ma',
                'sector' => 'Digital Communication',
                'files' => 'manzana_comms.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'MONARK IT',
                'sector' => 'Web & Mobile Development',
                'files' => 'monark_it.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Argyre Technology Services',
                'sector' => 'Geographic Information Systems & IT',
                'files' => 'argyre_gis.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'PixelPerfect',
                'sector' => 'Web Development',
                'files' => 'pixelperfect_web.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'DR WEB',
                'sector' => 'Software Development',
                'files' => 'drweb_software.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Business Intelligence Agency',
                'sector' => 'Software Development & BI',
                'files' => 'bi_agency.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'DIAVNET',
                'sector' => 'Digital Strategy & SEO',
                'files' => 'diavnet_strategy.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'CleanCode',
                'sector' => 'Web Development & Testing',
                'files' => 'cleancode_dev.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'PING THE PEAK',
                'sector' => 'Software Development',
                'files' => 'pingthepeak_software.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Taillis Labs',
                'sector' => 'Software Development & Mobile Apps',
                'files' => 'taillis_labs.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Gear9',
                'sector' => 'Software Development',
                'files' => 'gear9_software.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Lactic',
                'sector' => 'UX/UI Design & Software Development',
                'files' => 'lactic_ux.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Maroc Cloud',
                'sector' => 'Cloud Consulting',
                'files' => 'maroc_cloud.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'GEMADEC',
                'sector' => 'Software Development & Cybersecurity',
                'files' => 'gemadec_cyber.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Admiral Digital Consulting',
                'sector' => 'AI & Big Data Consulting',
                'files' => 'admiral_digital.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'EKBLOCKS',
                'sector' => 'Cybersecurity & IT Managed Services',
                'files' => 'ekblocks_cyber.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Finatech Group',
                'sector' => 'Back Office Outsourcing & IT',
                'files' => 'finatech_group.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'HMDServices',
                'sector' => 'IT Strategy Consulting',
                'files' => 'hmdservices_consult.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e505a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'N+ONE Datacenters',
                'sector' => 'Cloud Consulting & IT',
                'files' => 'nplusone_datacenters.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e505a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'M2T',
                'sector' => 'Accounting & IT Managed Services',
                'files' => 'm2t_services.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e505a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'ETAFAT',
                'sector' => 'IT Managed Services',
                'files' => 'etafat_it.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e505a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'KubicBits',
                'sector' => 'SaaS & Web Applications',
                'files' => 'kubicbits_saas.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e505a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'XORTECH',
                'sector' => 'SaaS & IT Solutions',
                'files' => 'xortech_solutions.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e505a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'Prime Synergy Group',
                'sector' => 'Software Engineering & Consulting',
                'files' => 'prime_synergy.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e505a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
            [
                'name' => 'OpenScale',
                'sector' => 'Cloud & Software Development',
                'files' => 'openscale_cloud.pdf',
                'logo' => 'https://images.unsplash.com/photo-1516321318423-f06f85e505a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
            ],
        ];
    
        $company = fake()->randomElement($companies);

        // Generate dynamic default logo URL using ui-avatars.com
        $defaultLogo = 'https://ui-avatars.com/api/?name=' . urlencode($company['name']) . '&color=ffffff&size=100';

        return [
            'user_id'=>User::factory()->create([
                    'role'=>'company'
                ]),
            'name' => $company['name'],
            'sector' => $company['sector'],
            'file' => $company['files'],
            'logo' => $defaultLogo,
        ];
    }
}